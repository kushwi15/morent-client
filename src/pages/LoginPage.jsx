/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../assets/LOGO.png";
import carImage from "../assets/car1.png";
import googleIcon from "../assets/google.png";
import facebookIcon from "../assets/facebook.png";
import appleIcon from "../assets/apple.png";
import "../styles/Login.css";

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    let requestData = { password: formData.password };

    if (emailRegex.test(formData.emailOrPhone)) {
      requestData.email = formData.emailOrPhone;
    } else if (phoneRegex.test(formData.emailOrPhone)) {
      requestData.phoneNumber = formData.emailOrPhone;
    } else {
      setError("Please enter a valid email or phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/login", requestData);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Incorrect email or password."
          : err.response?.status === 404
          ? "User not found."
          : "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Section - Image */}
        <div className="login-left">
          <img src={carImage} alt="Car Rental" className="car-image" />
        </div>

        {/* Right Section - Login Form */}
        <div className="login-right">
          <img src={logo} alt="Car Rental Logo" className="login-logo" />
          <div className="login-box">
            <h3 className="login-title">Login</h3>
            {error && <p className="error-text">{error}</p>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="inputbox-group">
                <Form.Control
                  type="text"
                  name="emailOrPhone"
                  placeholder="Email Address / Phone Number"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  required
                />
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

              <p className="forgot-password" onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </p>

              <Button className="continue-btn" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Continue"}
              </Button>
            </Form>

            <p className="toggle-text">
              Create an account{" "}
              <span className="toggle-link" onClick={() => navigate("/signup")}>
                Sign up
              </span>
            </p>

            <p className="or-text">or</p>

            {/* Social Login Options */}
            <div className="social-icons">
              <img src={googleIcon} alt="Google" className="social-icon" onClick={() => loginWithRedirect()} />
              <img src={facebookIcon} alt="Facebook" className="social-icon" onClick={() => loginWithRedirect()} />
              <img src={appleIcon} alt="Apple" className="social-icon" onClick={() => loginWithRedirect()} />
            </div>

            {/* Guest Login */}
            <button onClick={() => navigate("/home")} className="skip-btn">
              Sign up as guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
