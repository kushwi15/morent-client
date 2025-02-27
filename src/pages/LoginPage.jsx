import { useState } from "react";
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

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.emailOrPhone || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: formData.emailOrPhone, // Assuming backend expects "email"
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/home"); // Redirect after successful login
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleSkip = () => navigate("/home");
  const handleSignupRedirect = () => navigate("/signup");

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
            <h3 className="login-title">Login</h3>
            {error && <p className="error-text">{error}</p>}

            {/* Login Form */}
            <Form onSubmit={handleSubmit}>
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

              <p
                className="forgot-password"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </p>

              <Button className="continue-btn" type="submit">
                Continue
              </Button>
            </Form>

            {/* Signup Redirect */}
            <p className="toggle-text">
              Create an account{" "}
              <span className="toggle-link" onClick={handleSignupRedirect}>
                Sign up
              </span>
            </p>

            <p className="or-text">or</p>

            {/* Social Login Options */}
            <div className="social-icons">
              <img src={googleIcon} alt="Google" className="social-icon" />
              <img src={facebookIcon} alt="Facebook" className="social-icon" />
              <img src={appleIcon} alt="Apple" className="social-icon" />
            </div>

            {/* Guest Login */}
            <button onClick={handleSkip} className="skip-btn">
              Sign up as guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
