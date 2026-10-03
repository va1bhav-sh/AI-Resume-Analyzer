const express = require("express");

const authenticateUser = require("../middleware/authMiddleware");
const { syncUser } = require("../controllers/userController");

const User = require("../models/User");

const router = express.Router();

// Sync Firebase user with MongoDB
router.post("/sync", authenticateUser, syncUser);

// Get current user's information
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.user.uid,
    }).select("name email photoURL role");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User information fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Failed to fetch user information:", error);

    res.status(500).json({
      message: "Failed to fetch user information",
      error: error.message,
    });
  }
});

module.exports = router;