/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";
import logo from "../assets/LOGO.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Send OTP (simulated)
  const handleSendOTP = () => {
    if (method === "phone" && !phone) {
      setError("Please enter your phone number.");
      return;
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    setGeneratedOtp(newOtp);
    console.log("Generated OTP:", newOtp); // Debugging (Remove in production)
    setMessage(`OTP sent to your ${method}.`);
    setError("");
  };

  // Verify OTP
  const handleVerifyOTP = () => {
    if (otp === generatedOtp?.toString()) {
      setMessage("✅ OTP verified successfully! Now set your new password.");
      setOtpVerified(true);
      setError("");
    } else {
      setError("❌ Invalid OTP. Please try again.");
    }
  };

  // Handle Password Reset
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
      navigate("/");
    }, 3000);
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-container">
        <img src={logo} alt="Car Rental Logo" className="forgot-logo" />
        <div className="forgot-box">
          <h3 className="forgot-title">Forgot Password</h3>
          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          {!otpVerified ? (
            <>
              <Form.Group className="method-group">
                <Form.Label>Reset via:</Form.Label>
                <Form.Control as="select" value={method} onChange={(e) => setMethod(e.target.value)}>
                  <option value="email">Email</option>
                  <option value="phone">Phone Number</option>
                </Form.Control>
              </Form.Group>

              {method === "email" && (
                <Form.Group className="input-group">
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              )}

              {method === "phone" && (
                <Form.Group className="input-group">
                  <Form.Control
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Group>
              )}

              <Button className="reset-btn" onClick={handleSendOTP}>
                Send OTP
              </Button>

              {generatedOtp && (
                <>
                  <Form.Group className="input-group">
                    <Form.Control
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </Form.Group>
                  <Button className="reset-btn" onClick={handleVerifyOTP}>
                    Verify OTP
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Form.Group className="input-group">
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="input-group">
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>

              <Button className="reset-btn" onClick={handleResetPassword}>
                Reset Password
              </Button>
            </>
          )}

          <p className="back-to-login" onClick={() => navigate("/")}>
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
