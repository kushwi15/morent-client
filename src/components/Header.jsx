import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaSlidersH, FaHeart, FaBell, FaCog, FaUser, FaFileAlt, FaBook, FaGift, FaSignOutAlt, FaCommentDots, FaQuestionCircle, FaClipboardList, FaShieldAlt, FaInfoCircle, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Header.css";
import defaultProfilePic from "../assets/profile.png";
import logo from "../assets/LOGO.png";

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api";

const Header = ({ isGuest }) => {
  const [dropdowns, setDropdowns] = useState({ profile: false, settings: false });
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const profileRef = useRef(null);
  const settingsRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = (name) => setDropdowns(prev => ({ ...prev, [name]: !prev[name] }));

  const fetchProfile = async () => {
    if (isGuest) return;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;
      
      const { data } = await axios.get(`${API_BASE_URL}/profile/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (data?.profilePic) {
        const picUrl = data.profilePic instanceof File 
          ? data.profilePic.preview 
          : `${API_BASE_URL.replace('/api', '')}/uploads/${data.profilePic}`;
        setProfilePic(picUrl);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    const updateProfile = () => fetchProfile();
    window.addEventListener('profileUpdated', updateProfile);
    return () => window.removeEventListener('profileUpdated', updateProfile);
  }, [isGuest]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current?.contains(e.target) || settingsRef.current?.contains(e.target)) return;
      setDropdowns({ profile: false, settings: false });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const settingsItems = [
    { icon: FaCommentDots, text: "Write Feedback", action: () => {} },
    { icon: FaQuestionCircle, text: "FAQ", action: () => navigate("/faq") },
    { icon: FaClipboardList, text: "Terms & Conditions", action: () => navigate("/t&c") },
    { icon: FaShieldAlt, text: "Privacy Policy", action: () => navigate("/privacypolicy") },
    { icon: FaInfoCircle, text: "About Us", action: () => navigate("/about") },
    { icon: FaPhone, text: "Contact Us", action: () => navigate("/contact") }
  ];

  const profileItems = isGuest
    ? [{ icon: FaUser, text: "Login", action: () => navigate("/login") }]
    : [
        { icon: FaUser, text: "My Profile", action: () => navigate("/profile") },
        { icon: FaFileAlt, text: "Documents", action: () => {} },
        { icon: FaBook, text: "Bookings", action: () => {} },
        { icon: FaGift, text: "Rewards", action: () => {} },
        { icon: FaSignOutAlt, text: "Log Out", action: handleLogout, className: "logout-btn" }
      ];

  return (
    <nav className="header-container">
      <div className="left-section">
        <img src={logo} alt="Logo" className="logo" />
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search something here" className="search-input" />
          <FaSlidersH className="filter-icon" />
        </div>
      </div>

      <div className="icon-group">
        <span className="icon-circle"><FaHeart /></span>
        <span className="icon-circle notification"><FaBell /><span className="notification-dot" /></span>

        <div className="settings-dropdown-container" ref={settingsRef}>
          <span className="icon-circle" onClick={() => toggleDropdown('settings')}><FaCog /></span>
          {dropdowns.settings && (
            <div className="settings-dropdown">
              {settingsItems.map((item, i) => (
                <div key={i} className="dropdown-item" onClick={item.action}>
                  <item.icon className="dropdown-icon" />
                  <span className="dropdown-text">{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile-dropdown-container" ref={profileRef}>
          <div className="profile-pic-container" onClick={() => toggleDropdown('profile')}>
            <img src={profilePic} alt="User" className="profile-pic" onError={(e) => e.target.src = defaultProfilePic} />
          </div>
          {dropdowns.profile && (
            <div className="profile-dropdown">
              {profileItems.map((item, i) => (
                <div key={i} className={`dropdown-item ${item.className || ''}`} onClick={item.action}>
                  <item.icon className="dropdown-icon" />
                  <span className="dropdown-text">{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;