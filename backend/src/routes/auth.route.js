// Authentication routes for user management
import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/auth.controller.js";
import { checkAuth } from "../controllers/auth.controller.js";

const router = express.Router();

// User registration
router.post("/signup", signup);

// User login
router.post("/login", login);

// User logout
router.post("/logout", logout);

// Update user profile (protected)
router.put("/update-profile", protectRoute, updateProfile);

// Check authentication status (protected)
router.get("/check", protectRoute, checkAuth);

export default router;
