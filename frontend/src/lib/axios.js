import axios from "axios";

// Create a pre-configured axios instance for API requests
export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api", // Base URL for backend API
  withCredentials: true, // Send cookies with requests (for auth)
});
