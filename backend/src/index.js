// Core dependencies
import express from "express";
import dotenv from "dotenv";
import cookieParse from "cookie-parser";

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
app.use(express.json());
app.use(cookieParse());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Start server and connect to database
app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
