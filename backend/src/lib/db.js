// MongoDB connection utility
import mongoose from "mongoose";

// Connects to MongoDB using environment variable
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
  }
};
