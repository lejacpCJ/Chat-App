import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

// Zustand store for authentication state and actions
export const useAuthStore = create((set) => ({
  authUser: null, // Current authenticated user
  isSigningUp: false, // Signup loading state
  isLoggingIn: false, // Login loading state
  usUpdatingProfile: false, // Profile update loading state (typo: should be isUpdatingProfile)
  isCheckingAuth: true, // Auth check loading state

  // Check if user is authenticated by calling backend
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check"); // API call to check auth
      set({ authUser: res.data }); // Set user if authenticated
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null }); // Clear user on error
    } finally {
      set({ isCheckingAuth: false }); // Always stop loading
    }
  },
}));
