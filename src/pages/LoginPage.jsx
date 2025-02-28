/* eslint-disable no-unused-vars */
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
import { useAuth0 } from "@auth0/auth0-react";

const LoginPage = () => {
    const { loginWithRedirect } = useAuth0(); // Auth0 login function
  
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // if (!formData.emailOrPhone || !formData.password) {
    //   setError("Please fill in all fields.");
    //   return;
    // }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    let requestData = { fullName: formData.fullName, password: formData.password };

    if (emailRegex.test(formData.emailOrPhone)) {
      requestData.email = formData.emailOrPhone;
    } else if (phoneRegex.test(formData.emailOrPhone)) {
      requestData.phoneNumber = formData.emailOrPhone;
    } else {
      setError("Please enter a valid email or phone number.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: formData.emailOrPhone,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError("Incorrect email or password.");
        } else if (err.response.status === 404) {
          setError("User not found.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  const handleSkip = () => navigate("/home");
  const handleSignupRedirect = () => navigate("/signup");
  const handleForgotPassword = () => navigate("/forgot-password");

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <img src={carImage} alt="Car Rental" className="car-image" />
        </div>

        <div className="login-right">
          <img src={logo} alt="Car Rental Logo" className="login-logo" />
          <div className="login-box">
            <h3 className="login-title">Login</h3>
            {error && <p className="error-text">{error}</p>}

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
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </p>

              <Button className="continue-btn" type="submit">
                Continue
              </Button>
            </Form>

            <p className="toggle-text">
              Create an account{" "}
              <span className="toggle-link" onClick={handleSignupRedirect}>
                Sign up
              </span>
            </p>

            <p className="or-text">or</p>

           {/* Social Signup Options */}
                        <div className="social-icons">
                         <img src={googleIcon} alt="Google" className="social-icon" onClick={() => loginWithRedirect()} />
                         <img src={facebookIcon} alt="Facebook" className="social-icon" onClick={() => loginWithRedirect()}/>
                         <img src={appleIcon} alt="Apple" className="social-icon"onClick={() => loginWithRedirect()} />
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