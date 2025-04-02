/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/LOGO.png";
import carImage from "../assets/car1.png";
import googleIcon from "../assets/google.png";
import facebookIcon from "../assets/facebook.png";
import appleIcon from "../assets/apple.png";
import "../styles/Login.css";
import { useAuth0 } from "@auth0/auth0-react";

// Define the base API URL
// const API_BASE_URL = "http://localhost:5000/api/auth";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api/auth";

const SignupPage = () => {
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.password || !formData.confirmPassword) {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      // Include country code in the phone number when sending to the backend
      const payload = {
        ...formData,
        phoneNumber: countryCode + formData.phoneNumber
      };
      
      const response = await axios.post(`${API_BASE_URL}/signup`, payload);

      if (response.status === 201) {
        alert("Signup successful! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <img src={carImage} alt="Car Rental" className="car-image" />
        </div>
        <div className="login-right">
          <img src={logo} alt="Car Rental Logo" className="login-logo" />
          <div className="login-box">
            <h3 className="login-title">Sign Up</h3>
            {error && <p className="error-text">{error}</p>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="inputbox-group">
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="inputbox-group">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="inputbox-group">
                <div className="phone-input-container">
                  <Form.Control
                    as="select"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="country-code-select"
                  >
                    {["+91", "+1", "+44", "+86", "+81"].map((code) => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </Form.Control>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="phone-number-input"
                  />
                </div>
              </Form.Group>
              <Form.Group className="password-group">
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
              <Form.Group className="password-group">
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
                    <span>
                      I agree to the{" "}
                      <span className="terms-link">Terms & Privacy Policy</span>
                    </span>
                  }
                />
              </Form.Group>

              <Button className="continue-btn" type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Create an account"}
              </Button>
            </Form>

            <p className="toggle-text">
              Already have an account?{" "}
              <span className="toggle-link" onClick={() => navigate("/login")}>
                Login
              </span>
            </p>

            <p className="or-text">or</p>

            <div className="social-icons">
              <img
                src={googleIcon}
                alt="Google"
                className="social-icon"
                onClick={() => loginWithRedirect()}
              />
              <img
                src={facebookIcon}
                alt="Facebook"
                className="social-icon"
                onClick={() => loginWithRedirect()}
              />
              <img
                src={appleIcon}
                alt="Apple"
                className="social-icon"
                onClick={() => loginWithRedirect()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;


