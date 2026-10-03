const express = require("express");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");

const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

router.post(
  "/upload",
  authenticateUser,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No resume uploaded",
        });
      }

      // Only PDF files are supported
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({
          message: "Only PDF resumes are supported",
        });
      }

      const parser = new PDFParse({
        data: req.file.buffer,
      });

      const result = await parser.getText();

      const resumeText = result.text;

      await parser.destroy();

      console.log("Resume text extracted successfully");

      res.json({
        message: "Resume uploaded and text extracted successfully",
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        text: resumeText,
      });
    } catch (error) {
      console.error("Resume processing failed:", error);

      res.status(500).json({
        message: "Failed to process resume",
        error: error.message,
      });
    }
  }
);

module.exports = router;