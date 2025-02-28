/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";
import logo from "../assets/LOGO.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default to India
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Country codes (Add more as needed)
  const countryCodes = [
    { code: "+91", country: "India" },
    { code: "+1", country: "United States" },
    { code: "+44", country: "United Kingdom" },
    { code: "+86", country: "China" },
    { code: "+81", country: "Japan" },
    // Add more countries here
  ];

    // Clear input fields and reset state when the method changes
    useEffect(() => {
        setEmail("");
        setPhone("");
        setError(""); // Clear any previous errors
        setOtp("");
        setGeneratedOtp(null);
        setOtpVerified(false);
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
    }, [method]);

  // Send OTP (simulated)
  const handleSendOTP = () => {
    if (method === "phone") {
      if (!phone) {
        setError("Please enter your phone number.");
        return;
      }
      if (!/^\d+$/.test(phone)) {
        setError("Please enter a valid phone number.");
        return;
      }
    }

    if (method === "email") {
      if (!email) {
        setError("Please enter your email address.");
        return;
      }
      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }
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
                <Form.Control
                  as="select"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
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
                  <div className="phone-input-container">
                    <Form.Control
                      as="select"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="country-code-select"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.code} ({country.country})
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="phone-number-input"
                    />
                  </div>
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

          <p className="back-to-login" onClick={() => navigate("/login")}>
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;