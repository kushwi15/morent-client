/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";
import logo from "../assets/LOGO.png";
 
const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
 
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);
 
  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setMessage("✅ Password reset successfully! Redirecting to login...");
    setError("");
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };
 
  return (
    <div className="forgot-wrapper">
      <div className="forgot-container">
        <img src={logo} alt="Logo" className="forgot-logo" />
        <div className="forgot-box">
          <h3 className="forgot-title">Reset Password</h3>
          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}
 
          <Form.Group className="inputbox-group">
            <Form.Control type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </Form.Group>
 
          <Form.Group className="inputbox-group">
            <Form.Control type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </Form.Group>
 
          <Button className="reset-btn" onClick={handleResetPassword}>Reset Password</Button>
 
          <p className="back-to-login" onClick={() => navigate("/login")}>Back to Login</p>
        </div>
      </div>
    </div>
  );
};
 
export default ResetPassword;