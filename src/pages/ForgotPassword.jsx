import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ForgotPassword.css";
import logo from "../assets/LOGO.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("email");
  const [input, setInput] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default India
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const countryCodes = [
    { code: "+91", country: "India" },
    { code: "+1", country: "United States" },
    { code: "+44", country: "United Kingdom" },
    { code: "+86", country: "China" },
    { code: "+81", country: "Japan" },
  ];

  useEffect(() => {
    setInput("");
    setOtp("");
    setOtpSent(false);
    setMessage("");
    setError("");
  }, [method]);

  const handleSendOTP = async () => {
    if (!input) {
      setError(`Please enter your ${method === "email" ? "email" : "phone number"}.`);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        [method]: method === "phone" ? `${countryCode}${input}` : input,
      });

      setMessage(`OTP sent to your ${method}.`);
      setOtpSent(true);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    navigate("/reset-password", { state: { input, method } });
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-container">
        <img src={logo} alt="Car Rental Logo" className="forgot-logo" />
        <div className="forgot-box">
          <h3 className="forgot-title">Forgot Password</h3>
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}

          <Form.Group className="method-group">
            <Form.Label>Reset via:</Form.Label>
            <Form.Control as="select" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="email">Email</option>
              <option value="phone">Phone Number</option>
            </Form.Control>
          </Form.Group>

          {method === "email" && (
            <Form.Group className="inputbox-group">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={input}
                onChange={(e) => setInput(e.target.value)}
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
                  placeholder="Enter phone number"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="phone-number-input"
                />
              </div>
            </Form.Group>
          )}

          <Button className="reset-btn" onClick={handleSendOTP} disabled={otpSent}>
            Send OTP
          </Button>

          {otpSent && (
            <>
              <Form.Group className="inputbox-otp">
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

          <p className="back-to-login" onClick={() => navigate("/login")}>
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
