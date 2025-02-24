/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import "./Login.css";
import logo from "../assets/LOGO.png";
import carImage from "../assets/car1.png";
import googleIcon from "../assets/google.png";
import facebookIcon from "../assets/facebook.png";
import appleIcon from "../assets/apple.png";

const Login = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (isSignup) {
      if (!formData.fullName) {
        setError("Please enter your full name.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!formData.agreeTerms) {
        setError("You must agree to the Terms and Privacy Policy.");
        return;
      }
    }

    navigate("/home");
  };

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Section - Car Image */}
        <div className="login-left">
          <img src={carImage} alt="Car Rental" className="car-image" />
        </div>

        {/* Right Section - Form Box */}
        <div className="login-right">
          {/* Logo */}
          <img src={logo} alt="Car Rental Logo" className="login-logo" />

          {/* Login/Signup Box */}
          <div className="login-box">
            <h3 className="login-title">{isSignup ? "Sign Up" : "Login"}</h3>

            {error && <p className="error-text">{error}</p>}

            <Form onSubmit={handleSubmit}>
              {isSignup && (
                <Form.Group className="input-group">
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}

              <Form.Group className="input-group">
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Username/Mobile Number"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Password Input with Show/Hide */}
              <Form.Group className="input-group password-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </Form.Group>

              {/* Confirm Password Input (Only for Signup) */}
              {isSignup && (
                <Form.Group className="input-group password-group">
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </Form.Group>
              )}

              {/* Terms & Privacy Policy (Only in Signup) */}
              {isSignup && (
                <Form.Group className="checkbox-group">
                  <Form.Check
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    label={
                      <>
                        I agree to the{" "}
                        <span className="terms-link">Terms & Privacy Policy</span>
                      </>
                    }
                  />
                </Form.Group>
              )}

              {/* Forgot Password (Only in Login) */}
              {!isSignup && (
                <p className="forgot-password" onClick={() => navigate("/forgot-password")}>
                  Forgot Password?
                </p>
              )}

              <Button className="continue-btn" type="submit">
                {isSignup ? "Create an account" : "Continue"}
              </Button>
            </Form>

            {/* Toggle between Login & Signup */}
            <p className="toggle-text">
              {isSignup ? "Already have an account?" : "Create an account"}{" "}
              <span className="toggle-link" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Login" : "Sign up"}
              </span>
            </p>

            {/* OR Separator */}
            <p className="or-text">or</p>

            {/* Social Login Options */}
            <div className="social-icons">
              <img src={googleIcon} alt="Google" className="social-icon" />
              <img src={facebookIcon} alt="Facebook" className="social-icon" />
              <img src={appleIcon} alt="Apple" className="social-icon" />
            </div>

            {/* Skip Login Button (Only in Login) */}
            {!isSignup && (
              <button onClick={handleSkip} className="skip-btn">
                Sign up as guest
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
