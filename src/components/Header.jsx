import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaSlidersH, FaHeart, FaBell, FaCog, FaUser, FaFileAlt, FaBook, FaGift, FaSignOutAlt, FaCommentDots, FaQuestionCircle, FaClipboardList, FaShieldAlt, FaInfoCircle, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Header.css";
import defaultProfilePic from "../assets/profile.png"; // Default profile picture
import logo from "../assets/LOGO.png";

const Header = ({ isGuest }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [profilePic, setProfilePic] = useState(defaultProfilePic); // State for profile picture
  const profileDropdownRef = useRef(null);
  const settingsDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch profile data when the component mounts
  useEffect(() => {
    if (!isGuest) {
      fetchProfileData();
    }
  }, [isGuest]);

  // Fetch profile data from the backend
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.user_id) {
        console.error("User data not found in localStorage");
        return;
      }

      // const response = await axios.get(`http://localhost:5000/api/profile/${user.user_id}`, {
      const response = await axios.get(`https://morent-gjjg.onrender.com/api/profile/${user.user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.profilePic) {
        // Update the profile picture state with the fetched image
        // setProfilePic(`http://localhost:5000/uploads/${response.data.profilePic}`);
        setProfilePic(`https://morent-gjjg.onrender.com/uploads/${response.data.profilePic}`);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.response?.data || error.message);
    }
  };

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
        setShowSettingsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowProfileDropdown(false);
    navigate("/login"); // Redirect to login page
  };

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
        <span className="icon-circle notification">
          <FaBell />
          <span className="notification-dot"></span>
        </span>

        {/* Settings Dropdown */}
        <div className="settings-dropdown-container" ref={settingsDropdownRef}>
          <span className="icon-circle" onClick={() => setShowSettingsDropdown((prev) => !prev)}>
            <FaCog />
          </span>
          {showSettingsDropdown && (
            <div className="settings-dropdown">
              <div className="dropdown-item"><FaCommentDots className="dropdown-icon" /><span className="dropdown-text"> Write Feedback</span></div>
              <div className="dropdown-item" onClick={() => navigate("/faq")} style={{ cursor: "pointer" }}>
                <FaQuestionCircle className="dropdown-icon" />
                <span className="dropdown-text"> FAQ</span>
              </div>
              <div className="dropdown-item" onClick={() => navigate("/t&c")} style={{ cursor: "pointer" }}>
                <FaClipboardList className="dropdown-icon" />
                <span className="dropdown-text"> Terms & Conditions</span>
              </div>
              <div className="dropdown-item" onClick={() => navigate("/privacypolicy")} style={{ cursor: "pointer" }}>
                <FaShieldAlt className="dropdown-icon" />
                <span className="dropdown-text"> Privacy Policy</span>
              </div>
              <div className="dropdown-item" onClick={() => navigate("/about")} style={{ cursor: "pointer" }}>
                <FaInfoCircle className="dropdown-icon" />
                <span className="dropdown-text"> About Us</span>
              </div>
              <div className="dropdown-item" onClick={() => navigate("/contact")} style={{ cursor: "pointer" }}>
                <FaPhone className="dropdown-icon" />
                <span className="dropdown-text"> Contact Us</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="profile-dropdown-container" ref={profileDropdownRef}>
          <div className="profile-pic-container" onClick={() => setShowProfileDropdown((prev) => !prev)}>
            <img src={profilePic} alt="User" className="profile-pic" />
          </div>
          {showProfileDropdown && (
            <div className="profile-dropdown">
              {isGuest ? (
                <div className="dropdown-item" onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
                  <FaUser className="dropdown-icon" />
                  <span className="dropdown-text"> Login</span>
                </div>
              ) : (
                <>
                  <div className="dropdown-item" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
                    <FaUser className="dropdown-icon" />
                    <span className="dropdown-text"> My Profile</span>
                  </div>
                  <div className="dropdown-item"><FaFileAlt className="dropdown-icon" /><span className="dropdown-text"> Documents</span></div>
                  <div className="dropdown-item"><FaBook className="dropdown-icon" /><span className="dropdown-text"> Bookings</span></div>
                  <div className="dropdown-item"><FaGift className="dropdown-icon" /><span className="dropdown-text"> Rewards</span></div>
                  <div className="dropdown-item logout-btn" onClick={handleLogout}><FaSignOutAlt className="dropdown-icon" /><span className="dropdown-text"> Log Out</span></div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;