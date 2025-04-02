/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "../styles/ResetPassword.css";
import logo from "../assets/LOGO.png";

// Define the base API URL
// const API_BASE_URL = "http://localhost:5000/api/auth";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api/auth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

// Modify the handleResetPassword function:
const handleResetPassword = async () => {
  if (!newPassword || !confirmPassword) {
    setError("Please enter and confirm your new password.");
    return;
  }
  if (newPassword !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post(`${API_BASE_URL}/resetpassword`, {
      userId: state?.userId, // Add userId from state
      resetToken: state?.token, // Add token from state
      newPassword,
    });

    setMessage("✅ Password reset successfully! Redirecting...");
    setError("");

    setTimeout(() => navigate("/login"), 3000);
  } catch (error) {
    setError(error.response?.data?.message || "Failed to reset password.");
    setMessage("");
  }
  setLoading(false);
};

  return (
    <div className="reset-wrapper">
      <div className="reset-container">
        <img src={logo} alt="Logo" className="reset-logo" />
        <div className="reset-box">
          <h3 className="reset-title">Reset Password</h3>

          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          {/* New Password Input */}
          <Form.Group className="inputbox-group">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              aria-label="New Password"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              role="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </Form.Group>

          {/* Confirm Password Input */}
          <Form.Group className="inputbox-group">
            <Form.Control
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-label="Confirm New Password"
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              role="button"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </Form.Group>

          {/* Reset Password Button */}
          <Button className="reset-btn" onClick={handleResetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

          {/* Back to Login */}
          <p className="back-to-login" onClick={() => navigate("/login")}>
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;