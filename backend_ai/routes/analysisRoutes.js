const express = require("express");

const authenticateUser = require("../middleware/authMiddleware");

const User = require("../models/User");
const ResumeAnalysis = require("../models/ResumeAnalysis");

const router = express.Router();

// Get logged-in user's analysis history
router.get("/history", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const analyses = await ResumeAnalysis.find({
      userId: user._id,
    }).sort({ createdAt: -1 });

    res.json({
      message: "Analysis history fetched successfully",
      analyses,
    });
  } catch (error) {
    console.error("Failed to fetch analysis history:", error);

    res.status(500).json({
      message: "Failed to fetch analysis history",
      error: error.message,
    });
  }

});

// Get one analysis by ID
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found",
      });
    }

    res.json({
      message: "Analysis fetched successfully",
      analysis,
    });
  } catch (error) {
    console.error("Failed to fetch analysis:", error);

    res.status(500).json({
      message: "Failed to fetch analysis",
      error: error.message,
    });
  }
});
// Delete one analysis by ID
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const analysis = await ResumeAnalysis.findOneAndDelete({
      _id: req.params.id,
      userId: user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found",
      });
    }

    res.json({
      message: "Analysis deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete analysis:", error);

    res.status(500).json({
      message: "Failed to delete analysis",
      error: error.message,
    });
  }
}); 
module.exports = router;