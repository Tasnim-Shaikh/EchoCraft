import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase"; // Assuming you have this file

// Page Imports
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import UserDashboard from "./pages/user/UserDashboard";
import CreatePodcast from "./pages/user/CreatePodcast";

// Admin Imports
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManagePolls from "./pages/admin/ManagePolls";
import ManagePodcasts from "./pages/admin/ManagePodcasts";
import UploadContent from "./pages/admin/UploadContent";


// A simple component to protect admin routes
const AdminRoute = ({ children }) => {
  // Check if the currently logged-in user is the admin
  const isAdmin = auth.currentUser && auth.currentUser.email === "admin@example.com";
  return isAdmin ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Routes */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/create-podcast" element={<CreatePodcast />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="polls" element={<ManagePolls />} />
          <Route path="podcasts" element={<ManagePodcasts />} />
          <Route path="upload" element={<UploadContent />} />
        </Route>
        
         {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;