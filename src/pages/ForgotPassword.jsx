import { useState } from "react";
import { Button, Form, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ForgotPassword.css";
import logo from "../assets/LOGO.png";

// const API_BASE_URL = "http://localhost:5000/api/auth";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [method, setMethod] = useState("email");
  const [role, setRole] = useState("user");
  const [input, setInput] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const handleSendOTP = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        role,
        ...(method === "phone"
          ? { phoneNumber: countryCode + input }
          : { email: input }),
      };

      const response = await axios.post(`${API_BASE_URL}/forgotpassword`, payload);
      setOtpSent(true);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        role,
        ...(method === "phone"
          ? { phoneNumber: countryCode + input }
          : { email: input }),
        otp,
      };

      const response = await axios.post(`${API_BASE_URL}/verifyotp`, payload);
      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/reset-password", {
          state: {
            input,
            method,
            role,
            token: response.data.resetToken,
            userId: response.data.userId,
          },
        });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-container">
        <img src={logo} alt="Car Rental Logo" className="forgot-logo" />
        <div className="forgot-box">
          <h3 className="forgot-title">Forgot Password</h3>

          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="method-group">
            <Form.Label>Role:</Form.Label>
            <Form.Control
              as="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="owner">Owner</option>
            </Form.Control>
          </Form.Group>

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

          {method === "email" ? (
            <Form.Group className="inputbox-group">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Form.Group>
          ) : (
            <Form.Group className="inputbox-group">
              <div className="phone-input-container">
                <Form.Control
                  as="select"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="country-code-select"
                >
                  {["+91", "+1", "+44", "+86", "+81"].map((code) => (
                    <option key={code} value={code}>
                      {code}
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

          <Button
            className="reset-btn"
            onClick={handleSendOTP}
            disabled={loading || otpSent}
          >
            {loading ? <Spinner as="span" animation="border" size="sm" /> : "Send OTP"}
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
              <Button
                className="reset-btn"
                onClick={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  "Verify OTP"
                )}
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
