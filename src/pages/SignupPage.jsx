import { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';
import logo from "../assets/LOGO.png";
import carImage from "../assets/car1.png";
import keyImage from "../assets/key.png";
import { useAuth0 } from "@auth0/auth0-react";
import '../styles/SignUp.css';

// const API_BASE_URL = "http://localhost:5000/api/auth";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api/auth";

const SignupPage = () => {
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('user');
// Update the formData state initialization
const [formData, setFormData] = useState({
  fullName: '', 
  email: '', 
  countryCode: '+91', 
  phoneNumber: '',
  password: '', 
  confirmPassword: '', 
  agreeTerms: false,
  role: 'user'  // Changed from userType to role
});
  const [showPassword, setShowPassword] = useState({
    password: false, 
    confirmPassword: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

// Update the handleChange function
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({ 
    ...prev, 
    [name]: type === 'checkbox' ? checked : value,
    role: activePanel  // Changed from userType to role
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.phoneNumber || 
        !formData.password || !formData.confirmPassword) {
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
 // Update the payload construction
const payload = {
  ...formData,
  phoneNumber: formData.countryCode + formData.phoneNumber,
  role: activePanel  // Changed from userType to role
};
      
      const response = await axios.post(`${API_BASE_URL}/signup`, payload);

      if (response.status === 201) {
        alert(`${activePanel === 'user' ? 'User' : 'Owner'} account created successfully! Please log in.`);
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (field) => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  const showTerms = () => alert("Terms and Privacy Policy content would be displayed here.");

  const renderForm = (type) => (
    <form onSubmit={handleSubmit}>
      <img src={logo} alt="LOGO" className="logo" />  
      <h1>{type} Sign Up</h1>
      {error && <p className="error-text">{error}</p>}
      
      <input 
        type="text" 
        placeholder="Full Name" 
        name="fullName" 
        value={formData.fullName} 
        onChange={handleChange} 
        required 
      />
      
      <input 
        type="email" 
        placeholder="Email Address" 
        name="email" 
        value={formData.email} 
        onChange={handleChange} 
        required 
      />
      
      <div className="phone-input-container">
        <select 
          className="country-code-select" 
          name="countryCode" 
          value={formData.countryCode} 
          onChange={handleChange} 
          required
        >
          {["+91", "+1", "+44", "+86", "+81"].map(code => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
        <input 
          type="tel" 
          placeholder="Phone Number" 
          name="phoneNumber" 
          value={formData.phoneNumber} 
          onChange={handleChange} 
          required 
          className="phone-number-input" 
          pattern="[0-9]{10}" 
          title="10-digit phone number" 
        />
      </div>
      
      {['password', 'confirmPassword'].map(field => (
        <div key={field} className="password-group">
          <input 
            type={showPassword[field] ? "text" : "password"} 
            placeholder={field === 'password' ? 'Password' : 'Confirm Password'} 
            name={field} 
            value={formData[field]} 
            onChange={handleChange} 
            required 
            minLength={8} 
          />
          <span className="toggle-password" onClick={() => togglePassword(field)}>
            {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      ))}
      
      <div className="checkbox-group">
        <input 
          type="checkbox" 
          name="agreeTerms" 
          checked={formData.agreeTerms} 
          onChange={handleChange} 
          required 
        />
        <label>I agree to the <span className="terms-link" onClick={showTerms}>Terms & Privacy Policy</span></label>
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : `Create ${type} Account`}
      </button>
      
      <p className="toggle-text">
        Already have an account? <Link to="/login">Login</Link>
      </p>
      
      <span>or</span>

      <div className="social-icons signup-page">
  {[
    { Icon: FaGoogle, connection: 'google' },
    { Icon: FaFacebookF, connection: 'facebook' },
    { Icon: FaApple, connection: 'apple' },
  ].map(({ Icon, connection }, i) => (
    <a
      key={i}
      href="#"
      className="icon"
      onClick={(e) => {
        e.preventDefault(); // prevent page jump
        loginWithRedirect({ connection });
      }}
    >
      <Icon />
    </a>
  ))}
</div>

    </form>
  );

  return (
    <div className="signup-page">
      <div className={`container ${activePanel === 'owner' ? 'active' : ''}`}>
        <div className="form-container owner-signup">
          {activePanel === 'owner' && renderForm('Owner')}
        </div>
        <div className="form-container user-signup">
          {activePanel === 'user' && renderForm('User')}
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className={`toggle-panel toggle-left ${activePanel === 'user' ? 'active' : ''}`}>
              <img src={carImage} alt="Car" className="carnkey-image" />
              <h1>Need a Car?</h1>
              <p>Register as a user to book your favorite car</p>
              <button 
                className={activePanel === 'user' ? 'hidden' : ''} 
                onClick={() => setActivePanel('user')}
              >
                User Sign Up
              </button>
            </div>
            
            <div className={`toggle-panel toggle-right ${activePanel === 'owner' ? 'active' : ''}`}>
              <img src={keyImage} alt="Key" className="carnkey-image" />
              <h1>Own a Car?</h1>
              <p>Register as an owner to rent out your vehicles</p>
              <button 
                className={activePanel === 'owner' ? 'hidden' : ''} 
                onClick={() => setActivePanel('owner')}
              >
                Owner Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;