const express = require("express");

const authenticateUser = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const User = require("../models/User");
const ResumeAnalysis = require("../models/ResumeAnalysis");

const router = express.Router();

// Get all users
router.get(
  "/users",
  authenticateUser,
  requireAdmin,
  async (req, res) => {
    try {
      const users = await User.find()
        .sort({ createdAt: -1 });

      res.json({
        message: "Users fetched successfully",
        users,
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);

      res.status(500).json({
        message: "Failed to fetch users",
        error: error.message,
      });
    }
  }
);


// Get all resume analyses
router.get(
  "/analyses",
  authenticateUser,
  requireAdmin,
  async (req, res) => {
    try {
      const analyses = await ResumeAnalysis.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      res.json({
        message: "Analyses fetched successfully",
        analyses,
      });
    } catch (error) {
      console.error("Failed to fetch analyses:", error);

      res.status(500).json({
        message: "Failed to fetch analyses",
        error: error.message,
      });
    }
  }
);


// Get admin dashboard statistics
router.get(
  "/stats",
  authenticateUser,
  requireAdmin,
  async (req, res) => {
    try {
      const [totalUsers, totalAnalyses, scoreResult] =
        await Promise.all([
          User.countDocuments(),

          ResumeAnalysis.countDocuments(),

          ResumeAnalysis.aggregate([
            {
              $group: {
                _id: null,
                averageScore: {
                  $avg: "$score",
                },
              },
            },
          ]),
        ]);

      res.json({
        message: "Admin stats fetched successfully",

        stats: {
          totalUsers,
          totalAnalyses,
          averageScore:
            scoreResult[0]?.averageScore || 0,
        },
      });
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);

      res.status(500).json({
        message: "Failed to fetch admin stats",
        error: error.message,
      });
    }
  }
);


// Delete a user
router.delete(
  "/users/:id",
  authenticateUser,
  requireAdmin,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Prevent admin from deleting their own account
      if (user._id.equals(req.dbUser._id)) {
        return res.status(400).json({
          message: "You cannot delete your own admin account",
        });
      }

      // Delete user's analyses first
      await ResumeAnalysis.deleteMany({
        userId: user._id,
      });

      // Delete the user
      await User.findByIdAndDelete(user._id);

      res.json({
        message:
          "User and associated analyses deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete user:", error);

      res.status(500).json({
        message: "Failed to delete user",
        error: error.message,
      });
    }
  }
);


module.exports = router;