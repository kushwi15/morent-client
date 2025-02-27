import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaSlidersH, FaHeart, FaBell, FaCog, FaUser, FaFileAlt, FaBook, FaGift, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import profilePic from "../assets/profile.jpg";
import logo from "../assets/LOGO.png";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
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
        <span className="icon-circle"><FaCog /></span>

        <div className="profile-dropdown-container" ref={dropdownRef}>
          <div className="profile-pic-container" onClick={() => setShowDropdown((prev) => !prev)}>
            <img src={profilePic} alt="User" className="profile-pic" />
          </div>
          {showDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item"><FaUser className="dropdown-icon" /><span className="dropdown-text"> My Profile</span></div>
              <div className="dropdown-item"><FaFileAlt className="dropdown-icon" /><span className="dropdown-text"> Documents</span></div>
              <div className="dropdown-item"><FaBook className="dropdown-icon" /><span className="dropdown-text"> Bookings</span></div>
              <div className="dropdown-item"><FaGift className="dropdown-icon" /><span className="dropdown-text"> Rewards</span></div>
              <div className="dropdown-item logout-btn" onClick={handleLogout}><FaSignOutAlt className="dropdown-icon" /><span className="dropdown-text"> Log Out</span></div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
