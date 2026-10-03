const express = require("express");
const cohere = require("../config/cohere");

const authenticateUser = require("../middleware/authMiddleware");

const User = require("../models/User");
const ResumeAnalysis = require("../models/ResumeAnalysis");

const router = express.Router();

router.post("/analyze", authenticateUser, async (req, res) => {
  try {
    const { resumeText, jobDescription, resumeFileName } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        message: "Resume text is required",
      });
    }

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }
    if (resumeText.length > 50000) {
      return res.status(400).json({
        message: "Resume text is too large",
      });
    }

    if (jobDescription.length > 20000) {
      return res.status(400).json({
        message: "Job description is too large",
      });
    }

    // Find the MongoDB user using the Firebase UID
    const user = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const response = await cohere.chat({
      model: "command-a-plus-05-2026",

      messages: [
        {
          role: "user",
          content: `
You are an ATS resume analysis assistant.

Analyze the resume against the job description.

Evaluate:
1. Overall match score from 0 to 100.
2. A short summary of the match.
3. The candidate's strongest relevant skills.
4. Important skills missing from the resume.
5. Specific suggestions to improve the resume for this job.

Generate a JSON object using exactly the requested structure.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`,
        },
      ],

      response_format: {
        type: "json_object",
        schema: {
          type: "object",
          properties: {
            score: {
              type: "integer",
            },
            summary: {
              type: "string",
            },
            strengths: {
              type: "array",
              items: {
                type: "string",
              },
            },
            missingSkills: {
              type: "array",
              items: {
                type: "string",
              },
            },
            suggestions: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: [
            "score",
            "summary",
            "strengths",
            "missingSkills",
            "suggestions",
          ],
        },
      },

      temperature: 0,
    });

    const text = response?.message?.content?.find(
      (item) => item.type === "text"
    )?.text;

    if (!text) {
      return res.status(500).json({
        message: "Cohere returned no analysis",
      });
    }

    const analysis = JSON.parse(text);

    if (
      typeof analysis.score !== "number" ||
      analysis.score < 0 ||
      analysis.score > 100 ||
      !Number.isInteger(analysis.score)
    ) {
      return res.status(500).json({
        message: "Invalid score returned by AI",
      });
    }

    if (
      typeof analysis.summary !== "string" ||
      !Array.isArray(analysis.strengths) ||
      !Array.isArray(analysis.missingSkills) ||
      !Array.isArray(analysis.suggestions)
    ) {
      return res.status(500).json({
        message: "Invalid analysis format returned by AI",
      });
    }
    console.log("Resume analysis:");
    console.dir(analysis, { depth: null });

    // Save analysis to MongoDB
    const savedAnalysis = await ResumeAnalysis.create({
      userId: user._id,
      resumeFileName: resumeFileName || "Resume",
      jobDescription,
      score: analysis.score,
      summary: analysis.summary,
      strengths: analysis.strengths,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
    });

    console.log("Analysis saved to MongoDB:", savedAnalysis._id);

    res.json({
      message: "Resume analyzed successfully",
      analysis,
      analysisId: savedAnalysis._id,
    });
  } catch (error) {
    console.error("Resume analysis failed:", error);

    res.status(500).json({
      message: "Resume analysis failed",
      error: error.message,
    });
  }
});

module.exports = router;