import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

const isAuthenticated = () => !!localStorage.getItem("token");

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Admin Panel (Protected Route) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
                <AdminPanel />
            </PrivateRoute>
          }
        />

        {/* ✅ 404 Page */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
