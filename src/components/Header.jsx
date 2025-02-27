/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { FaSearch, FaSlidersH, FaHeart, FaBell, FaCog, FaTimes, FaEdit, FaSave } from "react-icons/fa";
import "../styles/Header.css";
import profilePic from "../assets/profile.jpg";
import logo from "../assets/LOGO.png";

const Header = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    dob: "1995-06-15",
    phone: "+1234567890",
    email: "johndoe@example.com",
    profilePic: profilePic,
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
  });

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowProfile(false);
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
    }
  };

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <>
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

          {/* Profile Picture Click */}
          <img src={formData.profilePic} alt="User" className="profile-pic" onClick={handleProfileClick} />
        </div>
      </nav>

      {/* Floating Profile Page */}
      {showProfile && (
        <div className="profile-modal-overlay" onClick={handleOutsideClick}>
          <div className="profile-modal" ref={modalRef}>
            <div className="profile-content">
              <FaTimes className="close-btn" onClick={handleProfileClick} />
              <h2>Profile Details</h2>

              {/* Edit Mode Toggle */}
              <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
                {editMode ? <FaSave /> : <FaEdit />} {editMode ? "Save" : "Edit"}
              </button>

              <div className="profile-picture">
                <img src={formData.profilePic instanceof File ? URL.createObjectURL(formData.profilePic) : formData.profilePic} alt="Profile" />
                {editMode && <input type="file" onChange={(e) => handleFileChange(e, "profilePic")} />}
              </div>

              <div className="profile-fields">
                <div>
                  <label>First Name:</label>
                  <input type="text" value={formData.firstName} onChange={(e) => handleInputChange(e, "firstName")} disabled={!editMode} />
                </div>
                <div>
                  <label>Last Name:</label>
                  <input type="text" value={formData.lastName} onChange={(e) => handleInputChange(e, "lastName")} disabled={!editMode} />
                </div>
                <div>
                  <label>Date of Birth:</label>
                  <input type="date" value={formData.dob} onChange={(e) => handleInputChange(e, "dob")} disabled={!editMode} />
                </div>
                <div>
                  <label>Phone Number:</label>
                  <input type="tel" value={formData.phone} onChange={(e) => handleInputChange(e, "phone")} disabled={!editMode} />
                </div>
                <div>
                  <label>Email:</label>
                  <input type="email" value={formData.email} onChange={(e) => handleInputChange(e, "email")} disabled={!editMode} />
                </div>
              </div>

              <h3>Documents</h3>
              <div className="document-upload">
                <div>
                  <label>Aadhaar Front:</label>
                  {formData.aadhaarFront && <img src={URL.createObjectURL(formData.aadhaarFront)} alt="Aadhaar Front" />}
                  {editMode && <input type="file" onChange={(e) => handleFileChange(e, "aadhaarFront")} />}
                </div>
                <div>
                  <label>Aadhaar Back:</label>
                  {formData.aadhaarBack && <img src={URL.createObjectURL(formData.aadhaarBack)} alt="Aadhaar Back" />}
                  {editMode && <input type="file" onChange={(e) => handleFileChange(e, "aadhaarBack")} />}
                </div>
                <div>
                  <label>PAN Card:</label>
                  {formData.panCard && <img src={URL.createObjectURL(formData.panCard)} alt="PAN Card" />}
                  {editMode && <input type="file" onChange={(e) => handleFileChange(e, "panCard")} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
