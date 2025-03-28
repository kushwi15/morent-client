import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaUser,
  FaFileAlt,
  FaBook,
  FaGift,
  FaSignOutAlt,
  FaCog,
  FaCommentDots,
  FaQuestionCircle,
  FaClipboardList,
  FaShieldAlt,
  FaInfoCircle,
} from "react-icons/fa";
import defaultProfilePic from "../assets/profile.png";
import "../styles/ContactUs.css";

// Define the base API URL
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api";

const ContactUs = () => {
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const settingsDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    fetchProfileData();

    // Close dropdowns on outside click
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

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.user_id) {
        setIsGuest(true);
        return;
      }

      setIsGuest(false);

      const response = await axios.get(`${API_BASE_URL}/profile/${user.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.profilePic) {
        setProfilePic(`${API_BASE_URL.replace('/api', '')}/uploads/${response.data.profilePic}`);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/contact`, formData);
      alert(response.data.message || "Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      alert("Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <section className="contact-section">
      {/* Header */}
      <div className="contact-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2>Contact Us</h2>

        <div className="icon-container">
          {/* Settings Dropdown */}
          <div className="settings-dropdown-container" ref={settingsDropdownRef}>
            <span className="icon-circle" onClick={() => setShowSettingsDropdown((prev) => !prev)}>
              <FaCog />
            </span>
            {showSettingsDropdown && (
              <div className="settings-dropdown">
                <div className="dropdown-item">
                  <FaCommentDots className="dropdown-icon" />
                  <span className="dropdown-text"> Write Feedback</span>
                </div>
                <div className="dropdown-item" onClick={() => navigate("/faq")}>
                  <FaQuestionCircle className="dropdown-icon" />
                  <span className="dropdown-text"> FAQ</span>
                </div>
                <div className="dropdown-item" onClick={() => navigate("/t&c")}>
                  <FaClipboardList className="dropdown-icon" />
                  <span className="dropdown-text"> Terms & Conditions</span>
                </div>
                <div className="dropdown-item" onClick={() => navigate("/privacypolicy")}>
                  <FaShieldAlt className="dropdown-icon" />
                  <span className="dropdown-text"> Privacy Policy</span>
                </div>
                <div className="dropdown-item" onClick={() => navigate("/about")} style={{ cursor: "pointer" }}>
                  <FaInfoCircle className="dropdown-icon" />
                  <span className="dropdown-text"> About Us</span>
                </div>
                <div className="dropdown-item" onClick={() => navigate("/contact")} style={{ cursor: "pointer" }}>
                  <FaPhoneAlt className="dropdown-icon" />
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
                    <span className="dropdown-text">Login</span>
                  </div>
                ) : (
                  <>
                    <div className="dropdown-item" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
                      <FaUser className="dropdown-icon" />
                      <span className="dropdown-text">My Profile</span>
                    </div>
                    <div className="dropdown-item">
                      <FaFileAlt className="dropdown-icon" />
                      <span className="dropdown-text">Documents</span>
                    </div>
                    <div className="dropdown-item">
                      <FaBook className="dropdown-icon" />
                      <span className="dropdown-text">Bookings</span>
                    </div>
                    <div className="dropdown-item">
                      <FaGift className="dropdown-icon" />
                      <span className="dropdown-text">Rewards</span>
                    </div>
                    <div className="dropdown-item logout-btn" onClick={handleLogout}>
                      <FaSignOutAlt className="dropdown-icon" />
                      <span className="dropdown-text">Log Out</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="contact-content">
        {/* Contact Form */}
        <div className="contact-form">
          <h3>Send Us a Message</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Write your message here"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" className="send-button" disabled={loading}>
              {loading ? "Sending..." : (
                <>
                  <FaPaperPlane /> Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p>
            <FaPhoneAlt /> <a href="tel:+911234567891">+91 1234567891</a>
          </p>
          <p>
            <FaEnvelope /> <a href="mailto:carrental@gmail.com">carrental@gmail.com</a>
          </p>
          <p>
            <FaMapMarkerAlt /> 1234 White Field, Bangalore
          </p>

          {/* Embedded Google Map */}
          <iframe
            title="Google Maps Location"
            className="map-frame"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.946489916979!2d77.7409162!3d12.9558171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1302aa8f3afd%3A0x12e5e8f11df20e45!2sBasel%20Dynamics%20Tech%20Solutions%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1700000000000"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;