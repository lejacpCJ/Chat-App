// Authentication controller for user registration, login, logout, profile update, and auth check
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Register a new user
export const signup = async (req, res) => {
  // Handles user registration
  const { fullName, email, password } = req.body;
  try {
    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists." });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // If user creation successful, generate JWT and respond
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      // Invalid user data
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    // Handle server errors
    console.error("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// User login
export const login = async (req, res) => {
  // Handles user login
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // User not found
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      // Invalid password
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    generateToken(user._id, res);

    // Respond with user info
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    // Handle server errors
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internet Server Error" });
  }
};
// User logout
export const logout = (req, res) => {
  // Handles user logout
  try {
    // Clear JWT cookie
    res.cookie("jwt", "", { maxAge: 0 });
    // Respond with logout message
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // Handle server errors
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update user profile picture
export const updateProfile = async (req, res) => {
  // Updates user's profile picture
  try {
    // Get profilePic from request body
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      // No profile picture provided
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    // Update user profilePic in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: True }
    );

    // Respond with updated user
    res.status(200).json(updatedUser);
  } catch (error) {
    // Handle server errors
    console.log("Error in update profile, error");
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check authentication status
export const checkAuth = (req, res) => {
  // Checks if user is authenticated
  try {
    // Respond with user info
    res.status(200).json(req.user);
  } catch (error) {
    // Handle server errors
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
