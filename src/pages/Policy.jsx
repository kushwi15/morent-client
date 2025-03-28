import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPhoneAlt,
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
import "../styles/Policy.css";

// Define the base API URL
// const API_BASE_URL = "http://localhost:5000/api/auth";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api/auth";

const PP = () => {
  // State management
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Refs and navigation
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const settingsDropdownRef = useRef(null);

  // Effects
  useEffect(() => {
    fetchProfileData();
    setupClickOutsideListeners();
    return () => cleanupClickOutsideListeners();
  }, []);

  // Event handlers
  const setupClickOutsideListeners = () => {
    document.addEventListener("mousedown", handleClickOutside);
  };

  const cleanupClickOutsideListeners = () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };

  const handleClickOutside = (event) => {
    if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
      setShowProfileDropdown(false);
    }
    if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
      setShowSettingsDropdown(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // API functions
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

  // Render functions
  const renderSettingsDropdown = () => (
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
      <div className="dropdown-item" onClick={() => navigate("/about")}>
        <FaInfoCircle className="dropdown-icon" />
        <span className="dropdown-text"> About Us</span>
      </div>
      <div className="dropdown-item" onClick={() => navigate("/contact")}>
        <FaPhoneAlt className="dropdown-icon" />
        <span className="dropdown-text"> Contact Us</span>
      </div>
    </div>
  );

  const renderProfileDropdown = () => (
    <div className="profile-dropdown">
      {isGuest ? (
        <div className="dropdown-item" onClick={() => navigate("/login")}>
          <FaUser className="dropdown-icon" />
          <span className="dropdown-text">Login</span>
        </div>
      ) : (
        <>
          <div className="dropdown-item" onClick={() => navigate("/profile")}>
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
  );

  const renderTermsContent = () => (
<div className="pp-content">
  <p>
    This Privacy Policy describes how MORENT collects, uses, 
    and shares your personal information when you use our car rental platform and services. 
    At MORENT, we are committed to protecting your privacy and ensuring the security of your 
    personal data. By using our website and services, you consent to the practices described 
    in this Privacy Policy.
  </p>
  
  <h3>1. Information We Collect</h3>
  <p>
    To provide our car rental services, we may collect the following information:
  </p>
  <ul>
    <li><strong>Personal Details:</strong> Name, email, phone number, driver's license information, and payment details when you make a booking.</li>
    <li><strong>Vehicle Information:</strong> Details about the cars you view, book, or rent through our platform.</li>
    <li><strong>Device Information:</strong> Device type, IP address, browser type, and location data (with your consent) to optimize your rental experience.</li>
    <li><strong>Usage Data:</strong> How you interact with our platform, including search history, booking patterns, and preferences.</li>
    <li><strong>Driving Data:</strong> For certain rentals, we may collect mileage, fuel levels, and vehicle condition reports.</li>
  </ul>
  
  <h3>2. Your Rights</h3>
  <ul>
    <li><strong>Access:</strong> Request a copy of the personal information we hold about your rentals and account.</li>
    <li><strong>Correction:</strong> Update or correct your driver profile, payment methods, or account details.</li>
    <li><strong>Deletion:</strong> Request deletion of your account and personal data, subject to legal retention requirements.</li>
    <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails about special offers and promotions.</li>
    <li><strong>Data Portability:</strong> Request your rental history and account data in a digital format.</li>
    <li><strong>Booking Management:</strong> Modify or cancel upcoming reservations through your account.</li>
  </ul>
  
  <h3>3. Data Sharing</h3>
  <ul>
    <li>
      <strong>With Rental Partners:</strong><br />
      We share necessary information with our network of car rental providers to fulfill your bookings.
    </li>
    <li>
      <strong>With Payment Processors:</strong><br />
      Your payment details are securely processed by certified payment service providers.
    </li>
    <li>
      <strong>With Insurance Providers:</strong><br />
      When you opt for rental insurance, relevant details are shared with our insurance partners.
    </li>
    <li>
      <strong>For Legal Compliance:</strong><br />
      We may disclose information when required by law, such as for traffic violations or accidents.
    </li>
    <li>
      <strong>With Service Providers:</strong><br />
      Trusted partners who assist with customer support, IT services, and fraud prevention.
    </li>
  </ul>
  
  <h3>4. Security Measures</h3>
  <p>
    MORENT implements robust security measures to protect your data:
  </p>
  <ul>
    <li>Encryption of all sensitive data during transmission and storage</li>
    <li>Regular security audits of our systems</li>
    <li>Limited employee access to personal information</li>
    <li>Secure payment processing compliant with PCI DSS standards</li>
    <li>Two-factor authentication for account access</li>
  </ul>
  
  <h3>5. Policy Updates</h3>
  <p>
    We may update this Privacy Policy to reflect changes in our services or legal requirements. 
    Significant changes will be communicated through our platform or via email. The updated 
    version will be indicated by the "Last Updated" date at the top of this page.
  </p>
  
  <h3>6. Contact Us</h3>
  <p>
    For any privacy-related questions or requests, please contact our Data Protection Officer at:<br />
    <strong>Email:</strong> privacy@morent.com<br />
    <strong>Phone:</strong> +1 (800) RENT-NOW<br />
    <strong>Address:</strong> MORENT Privacy Office, 123 Rental Drive, Suite 100, Auto City, CA 90210
  </p>
</div>
  );

  return (
    <section className="pp-section">
      {/* Header */}
      <div className="pp-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2>Privacy Policy</h2>

        <div className="icon-container">
          {/* Settings Dropdown */}
          <div className="settings-dropdown-container" ref={settingsDropdownRef}>
            <span className="icon-circle" onClick={() => setShowSettingsDropdown((prev) => !prev)}>
              <FaCog />
            </span>
            {showSettingsDropdown && renderSettingsDropdown()}
          </div>

          {/* Profile Dropdown */}
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <div className="profile-pic-container" onClick={() => setShowProfileDropdown((prev) => !prev)}>
              <img src={profilePic} alt="User" className="profile-pic" />
            </div>
            {showProfileDropdown && renderProfileDropdown()}
          </div>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <div className="pp-content-container">
        {renderTermsContent()}
      </div>
    </section>
  );
};

export default PP;