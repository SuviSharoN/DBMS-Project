// Frontend/src/Components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  if (!token) {
    // Not logged in
    console.log("ProtectedRoute: No token found, redirecting to login.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Logged in, but wrong role
    console.log(`ProtectedRoute: Role mismatch. User role: ${userRole}, Allowed: ${allowedRoles}. Redirecting to previous or home.`);
    // Redirect to a generic dashboard or back where they came from, or show an unauthorized page
    // For simplicity, redirecting back might be confusing, maybe redirect to their own dashboard?
    // Or just show an "Unauthorized" component within the Outlet space?
    // Let's redirect to login for now, but a dedicated "Unauthorized" page is better.
     return <Navigate to="/login" state={{ message: "Unauthorized Access" }} replace />;
     // Or return <Navigate to="/" replace />; // Redirect to login/home
     // Or return <div>Unauthorized Access</div>;
  }

  // Logged in and has correct role (or no specific role required)
  return <Outlet />; // Render the child route component
};

export default ProtectedRoute;