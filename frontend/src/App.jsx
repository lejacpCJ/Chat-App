import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirects
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const App = () => {
  // Get authentication state and actions from store
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // On mount, check authentication status
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  // Show loading spinner while checking auth
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex item-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  // Render main app with navigation and routes
  return (
    <div>
      <Navbar />
      <Routes>
        {/* Home route: only for authenticated users */}
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        {/* Signup route: only for unauthenticated users */}
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        {/* Login route: only for unauthenticated users */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        {/* Settings route: accessible to all users */}
        <Route path="/settings" element={<SettingPage />} />
        {/* Profile route: only for authenticated users */}
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
