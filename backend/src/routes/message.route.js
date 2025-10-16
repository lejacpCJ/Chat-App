// Message routes for chat functionality
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// Get all users except the logged-in user (sidebar)
router.get("/users", protectRoute, getUsersForSidebar);

// Get message history between logged-in user and another user
router.get("/:id", protectRoute, getMessages);

// Send a new message to another user
router.post("/send/:id", protectRoute, sendMessage);

export default router;
