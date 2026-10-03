const adminAuth = require("../config/firebaseAdmin");
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication token is missing",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];

const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
};

module.exports = authenticateUser;