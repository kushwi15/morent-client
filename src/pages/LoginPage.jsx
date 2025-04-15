import { useState, useEffect, useRef } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import logo from "../assets/LOGO.png";
import carImage from "../assets/car1.png";
import keyImage from "../assets/key.png";
import '../styles/Login.css';

// const API_BASE_URL = "http://localhost:5000/api/auth";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();

  const [activePanel, setActivePanel] = useState('user');
  const [formData, setFormData] = useState({ identifier: '', countryCode: '+91', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [inputMode, setInputMode] = useState('text');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const isUser = activePanel === 'user';

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [inputMode, activePanel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmed = value.trim();

    if (name === 'identifier') {
      const newMode = trimmed.includes('@') ? 'email' : /^\d+$/.test(trimmed) ? 'tel' : 'text';
      if (newMode !== inputMode) setInputMode(newMode);

      const cleaned = newMode === 'tel' ? trimmed.replace(/\D/g, '') : trimmed;
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [name]: trimmed }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { identifier, password, countryCode } = formData;
      if (!identifier || !password) throw new Error("Please fill in all required fields.");

      const payload = {
        [inputMode === 'tel' ? 'phoneNumber' : 'email']: inputMode === 'tel' ? `${countryCode}${identifier}` : identifier,
        password,
        role: activePanel
      };

      const { data } = await axios.post(`${API_BASE_URL}/login`, payload);
      const { token, user } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate(isUser ? '/home' : '/owner-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    loginWithRedirect({
      connection: provider,
      appState: { role: activePanel }
    });
  };

  
  const renderInputField = () => {
    if (inputMode === 'tel') {
      return (
        <div className="phone-input-container">
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="country-code-select"
            disabled={loading}
          >
            {["+91", "+1", "+44", "+86", "+81"].map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
          <input
            ref={inputRef}
            type="tel"
            name="identifier"
            placeholder="Phone Number"
            value={formData.identifier}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
      );
    }

    return (
      <input
        ref={inputRef}
        type={inputMode === 'email' ? 'email' : 'text'}
        name="identifier"
        placeholder={inputMode === 'email' ? 'Email Address' : 'Email or Phone'}
        value={formData.identifier}
        onChange={handleChange}
        required
        disabled={loading}
      />
    );
  };

  return (
    <div className="login-page">
      <div className={`container ${!isUser ? 'active' : ''}`}>
        <div className={`form-container ${activePanel}-login`}>
          <form onSubmit={handleLogin}>
            <img src={logo} alt="Logo" className="logo" />
            <h1>{isUser ? 'User' : 'Owner'} Login</h1>

            {error && <div className="error-message">{error}</div>}

            {renderInputField()}

            <div className="password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <span
                className="toggle-password"
                onClick={() => !loading && setShowPassword(!showPassword)}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => !loading && e.key === 'Enter' && setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <p
              className="forgot-password"
              onClick={() => !loading && navigate("/forgot-password")}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => !loading && e.key === 'Enter' && navigate("/forgot-password")}
            >
              Forgot Password?
            </p>

            <button type="submit" className="continue-btn" disabled={loading}>
              {loading ? <span className="spinner"></span> : `Continue as ${isUser ? 'User' : 'Owner'}`}
            </button>

            <p className="toggle-text">
              Don’t have an account? <Link to="/signup">Sign Up</Link>
            </p>

            <span>or</span>

            <div className="social-icons signup-page" style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
              {[
                { Icon: FaGoogle, connection: 'google' },
                { Icon: FaFacebookF, connection: 'facebook' },
                { Icon: FaApple, connection: 'apple' },
              ].map(({ Icon, connection }, index) => (
                <a
                  key={index}
                  href="#"
                  className="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSocialLogin(connection);
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate("/guest")}
              className="skip-btn"
              disabled={loading}
            >
              Continue as Guest
            </button>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className={`toggle-panel toggle-left ${isUser ? 'active' : ''}`}>
              <img src={carImage} alt="Rent a car" className="carnkey-image" />
              <h1>Need a Car?</h1>
              <p>Login to book your favorite car</p>
              {!isUser && (
                <button
                  onClick={() => setActivePanel('user')}
                  className="panel-switch-btn"
                  disabled={loading}
                >
                  User Login
                </button>
              )}
            </div>
            <div className={`toggle-panel toggle-right ${!isUser ? 'active' : ''}`}>
              <img src={keyImage} alt="Rent your car" className="carnkey-image" />
              <h1>Own a Car?</h1>
              <p>Login to rent out your vehicles</p>
              {isUser && (
                <button
                  onClick={() => setActivePanel('owner')}
                  className="panel-switch-btn"
                  disabled={loading}
                >
                  Owner Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
