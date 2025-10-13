const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get token from cookies
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      } else {
        token = req.headers.authorization; // in case client sends raw token
      }
    }
    console.log(token)

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    // 3. Find user
    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = currentUser;
    next();

  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ msg: "Token verification failed" });
  }
};

module.exports = authMiddleware;

