/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/LOGO.png";
import carImage from "../assets/car1.png";
import googleIcon from "../assets/google.png";
import facebookIcon from "../assets/facebook.png";
import appleIcon from "../assets/apple.png";
import "../styles/Login.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.emailOrPhone || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
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

    navigate("/home");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Section */}
        <div className="login-left">
          <img src={carImage} alt="Car Rental" className="car-image" />
        </div>

        {/* Right Section */}
        <div className="login-right">
          <img src={logo} alt="Car Rental Logo" className="login-logo" />
          <div className="login-box">
            <h3 className="login-title">Sign Up</h3>
            {error && <p className="error-text">{error}</p>}

            {/* Signup Form */}
            <Form onSubmit={handleSubmit}>
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
              <Form.Group className="input-group">
                <Form.Control
                  type="text"
                  name="emailOrPhone"
                  placeholder="Email Address / Phone Number"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
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

              <Form.Group className="checkbox-group">
                <Form.Check
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  label={
                    <>
                      I agree to the{" "}
                      <span className="terms-link">
                        Terms & Privacy Policy
                      </span>
                    </>
                  }
                />
              </Form.Group>

              <Button className="continue-btn" type="submit">
                Create an account
              </Button>
            </Form>

            {/* Login Redirect */}
            <p className="toggle-text">
              Already have an account?{" "}
              <span className="toggle-link" onClick={handleLoginRedirect}>
                Login
              </span>
            </p>

            <p className="or-text">or</p>

            {/* Social Signup Options */}
            <div className="social-icons">
              <img src={googleIcon} alt="Google" className="social-icon" />
              <img src={facebookIcon} alt="Facebook" className="social-icon" />
              <img src={appleIcon} alt="Apple" className="social-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
