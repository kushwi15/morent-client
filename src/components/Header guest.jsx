import { useState, useEffect, useRef } from "react";
import { FaSearch, FaSlidersH, FaHeart, FaBell, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import profilePic from "../assets/profile.png";
import logo from "../assets/LOGO.png";

const Headerguest = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        <span className="icon-circle">
          <FaCog />
        </span>

        {/* Profile Dropdown */}
        <div className="profile-dropdown-container" ref={profileDropdownRef}>
          <div className="profile-pic-container" onClick={() => setShowProfileDropdown((prev) => !prev)}>
            <img src={profilePic} alt="User" className="profile-pic" />
          </div>
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={() => navigate("/signup")}> <FaUser className="dropdown-icon" /><span className="dropdown-text"> SignUp</span></div>
              <div className="dropdown-item" onClick={() => navigate("/login")}> <FaSignOutAlt className="dropdown-icon" /><span className="dropdown-text"> Login</span></div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Headerguest;
