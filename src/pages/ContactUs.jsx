import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane,
  FaUser, FaFileAlt, FaBook, FaGift, FaSignOutAlt,
  FaCog, FaCommentDots, FaQuestionCircle, FaClipboardList,
  FaShieldAlt, FaInfoCircle
} from "react-icons/fa";
import defaultProfilePic from "../assets/profile.png";
import "../styles/ContactUs.css";

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api";

const ContactUs = () => {
  // State
  const [state, setState] = useState({
    profilePic: defaultProfilePic,
    showProfileDropdown: false,
    showSettingsDropdown: false,
    isGuest: true,
    formData: {
      name: "",
      email: "",
      phone: "",
      message: ""
    },
    loading: false
  });

  // Refs and navigation
  const navigate = useNavigate();
  const refs = {
    profile: useRef(null),
    settings: useRef(null)
  };

  // Effects
  useEffect(() => {
    fetchProfile();
    const updateProfile = () => fetchProfile();
    window.addEventListener('profileUpdated', updateProfile);
    return () => window.removeEventListener('profileUpdated', updateProfile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (refs.profile.current?.contains(e.target) || refs.settings.current?.contains(e.target)) return;
      setState(p => ({...p, showProfileDropdown: false, showSettingsDropdown: false}));
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Profile functions
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user?._id) return setState(p => ({...p, isGuest: true}));

    try {
      const { data } = await axios.get(`${API_BASE_URL}/profile/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data?.profilePic) {
        const picUrl = data.profilePic instanceof File ? data.profilePic.preview 
          : `${API_BASE_URL.replace('/api', '')}/uploads/${data.profilePic}`;
        setState(p => ({...p, profilePic: picUrl, isGuest: false}));
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Form handlers
  const handleChange = (e) => {
    setState(p => ({
      ...p,
      formData: {
        ...p.formData,
        [e.target.name]: e.target.value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setState(p => ({...p, loading: true}));
      const response = await axios.post(`${API_BASE_URL}/contact`, state.formData);
      alert(response.data.message || "Message sent successfully!");
      setState(p => ({
        ...p,
        formData: { name: "", email: "", phone: "", message: "" },
        loading: false
      }));
    } catch (error) {
      alert("Error sending message. Please try again.");
      setState(p => ({...p, loading: false}));
    }
  };

  // Dropdown items
  const dropdownItems = {
    settings: [
      { icon: FaCommentDots, text: "Write Feedback" },
      { icon: FaQuestionCircle, text: "FAQ", action: () => navigate("/faq") },
      { icon: FaClipboardList, text: "Terms & Conditions", action: () => navigate("/t&c") },
      { icon: FaShieldAlt, text: "Privacy Policy", action: () => navigate("/privacypolicy") },
      { icon: FaInfoCircle, text: "About Us", action: () => navigate("/about") },
      { icon: FaPhoneAlt, text: "Contact Us", action: () => navigate("/contact") }
    ],
    profile: state.isGuest
      ? [{ icon: FaUser, text: "Login", action: () => navigate("/login") }]
      : [
          { icon: FaUser, text: "My Profile", action: () => navigate("/profile") },
          { icon: FaFileAlt, text: "Documents" },
          { icon: FaBook, text: "Bookings" },
          { icon: FaGift, text: "Rewards" },
          { icon: FaSignOutAlt, text: "Log Out", action: handleLogout, className: "logout-btn" }
        ]
  };

  return (
    <section className="contact-section">
      {/* Header */}
      <div className="contact-header">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <h2>Contact Us</h2>

        <div className="icon-container">
          {/* Settings Dropdown */}
          <div className="settings-dropdown-container" ref={refs.settings}>
            <span 
              className="icon-circle" 
              onClick={() => setState(p => ({...p, showSettingsDropdown: !p.showSettingsDropdown}))}
              aria-label="Settings"
            >
              <FaCog />
            </span>
            {state.showSettingsDropdown && (
              <div className="settings-dropdown">
                {dropdownItems.settings.map((item, i) => (
                  <div key={i} className="dropdown-item" onClick={item.action}>
                    <item.icon className="dropdown-icon" />
                    <span className="dropdown-text">{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="profile-dropdown-container" ref={refs.profile}>
            <div 
              className="profile-pic-container" 
              onClick={() => setState(p => ({...p, showProfileDropdown: !p.showProfileDropdown}))}
              aria-label="User profile"
            >
              <img 
                src={state.profilePic} 
                alt="User" 
                className="profile-pic" 
                onError={(e) => e.target.src = defaultProfilePic}
              />
            </div>
            {state.showProfileDropdown && (
              <div className="profile-dropdown">
                {dropdownItems.profile.map((item, i) => (
                  <div 
                    key={i} 
                    className={`dropdown-item ${item.className || ''}`} 
                    onClick={item.action}
                  >
                    <item.icon className="dropdown-icon" />
                    <span className="dropdown-text">{item.text}</span>
                  </div>
                ))}
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
              value={state.formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={state.formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={state.formData.phone}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Write your message here"
              value={state.formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" className="send-button" disabled={state.loading}>
              {state.loading ? "Sending..." : (
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