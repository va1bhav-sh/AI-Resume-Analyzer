    const User = require("../models/User");

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    // Store database user for later admin routes
    req.dbUser = user;

    next();
  } catch (error) {
    console.error("Admin authorization error:", error.message);

    return res.status(500).json({
      message: "Failed to verify admin access",
    });
  }
};

module.exports = requireAdmin;