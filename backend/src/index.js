// Core dependencies
import express from "express";
import dotenv from "dotenv";
import cookieParse from "cookie-parser";
import cors from "cors";

// Import database connection and route modules
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParse()); // Parse cookies from the request
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from frontend
    credentials: true, // Allow cookies to be sent cross-origin
  })
); // Enable CORS for frontend

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Start server and connect to database
app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
