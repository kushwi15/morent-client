import { useState, useEffect, useRef } from "react";
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

// const API_BASE_URL = "http://localhost:5000/api/auth";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api/auth";

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [countryCode, setCountryCode] = useState("+91");
  const [inputMode, setInputMode] = useState("text"); // 'text', 'email', or 'tel'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Maintain focus when input type changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputMode]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, emailOrPhone: value });

    // Determine input mode without changing it unnecessarily
    if (value.includes("@")) {
      setInputMode("email");
    } else if (/^\d*$/.test(value)) {
      setInputMode("tel");
    } else {
      setInputMode("text");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isEmail = inputMode === "email";
      const identifier = isEmail
        ? formData.emailOrPhone
        : `${countryCode}${formData.emailOrPhone.replace(/\D/g, '')}`;

      const { data } = await axios.post(`${API_BASE_URL}/login`, {
        [isEmail ? "email" : "phoneNumber"]: identifier,
        password: formData.password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
            <h3 className="login-title">Login</h3>
            {error && <p className="error-text">{error}</p>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="inputbox-group">
                {inputMode === "tel" ? (
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
                      ref={inputRef}
                      name="emailOrPhone"
                      placeholder="Phone Number"
                      value={formData.emailOrPhone}
                      onChange={handleInputChange}
                      required
                      className="phone-number-input"
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </div>
                ) : (
                  <Form.Control
                    type={inputMode}
                    ref={inputRef}
                    name="emailOrPhone"
                    placeholder={inputMode === "email" ? "Email Address" : "Email or Phone"}
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    required
                    inputMode={inputMode === "email" ? "email" : "text"}
                  />
                )}
              </Form.Group>

              <Form.Group className="password-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
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

            <div className="social-icons">
              {[googleIcon, facebookIcon, appleIcon].map((icon, index) => (
                <img key={index} src={icon} alt="Social Login" className="social-icon" onClick={loginWithRedirect} />
              ))}
            </div>

            <button onClick={() => navigate("/guest")} className="skip-btn">
              Sign up as guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;