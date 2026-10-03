const User = require("../models/User");

const syncUser = async (req, res) => {
  try {
    const { uid, name, email, picture } = req.user;

    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.photoURL = picture || user.photoURL;

      await user.save();

      return res.status(200).json({
        message: "User updated successfully",
        user,
      });
    }

    user = await User.create({
      firebaseUid: uid,
      name: name || "User",
      email,
      photoURL: picture || "",
    });

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("User sync error:", error.message);

    return res.status(500).json({
      message: "Failed to sync user",
    });
  }
};

module.exports = {
  syncUser,
};