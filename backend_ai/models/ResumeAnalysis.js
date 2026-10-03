const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resumeFileName: {
      type: String,
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    summary: {
      type: String,
      required: true,
    },

    strengths: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);