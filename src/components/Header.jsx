/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaSlidersH, FaHeart, FaBell, FaCog } from "react-icons/fa";
import "../styles/Header.css"; 
import profilePic from "../assets/profile.jpg";
import logo from "../assets/LOGO.png";

const Header = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/"); // Redirect to Login Page
  };

  return (
    <nav className="header-container">
      {/* Left Section: Logo + Search Bar */}
      <div className="left-section">
        <img src={logo} alt="Logo" className="logo" />

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search something here" className="search-input" />
          <FaSlidersH className="filter-icon" />
        </div>
      </div>

      {/* Right Section: Icons */}
      <div className="icon-group">
        <span className="icon-circle">
          <FaHeart />
        </span>
        <span className="icon-circle notification">
          <FaBell />
          <span className="notification-dot"></span>
        </span>
        <span className="icon-circle">
          <FaCog />
        </span>

        {/* Profile Picture with Redirect */}
        <img
          src={profilePic}
          alt="User"
          className="profile-pic"
          onClick={handleProfileClick}
        />
      </div>
    </nav>
  );
};

export default Header;