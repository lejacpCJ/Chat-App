// Middleware to protect routes by verifying JWT and user
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Checks for JWT in cookies, verifies token, and attaches user to request
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    // No token provided
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Find user by decoded userId
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
