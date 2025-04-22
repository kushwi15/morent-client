import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPhoneAlt, FaUser, FaFileAlt, FaBook, FaGift, FaSignOutAlt,
  FaCog, FaCommentDots, FaQuestionCircle, FaClipboardList,
  FaShieldAlt, FaInfoCircle
} from "react-icons/fa";
import defaultProfilePic from "../assets/profile.png";
import "../styles/Policy.css";

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api";

const PP = () => {
  // State
  const [state, setState] = useState({
    profilePic: defaultProfilePic,
    showProfileDropdown: false,
    showSettingsDropdown: false,
    isGuest: true
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
      const { data } = await axios.get(`${API_BASE_URL}/userProfile/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data?.profilePic) {
        const picUrl = data.profilePic instanceof File ? data.profilePic.preview 
          : `${API_BASE_URL.replace('/api', '')}/uploads/users/${data.profilePic}`;
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

  // Privacy Policy content
  const privacyContent = [
    {
      intro: "This Privacy Policy describes how MORENT collects, uses, and shares your personal information when you use our car rental platform and services. At MORENT, we are committed to protecting your privacy and ensuring the security of your personal data. By using our website and services, you consent to the practices described in this Privacy Policy."
    },
    {
      title: "1. Information We Collect",
      content: "To provide our car rental services, we may collect the following information:",
      items: [
        "Personal Details: Name, email, phone number, driver's license information, and payment details when you make a booking.",
        "Vehicle Information: Details about the cars you view, book, or rent through our platform.",
        "Device Information: Device type, IP address, browser type, and location data (with your consent) to optimize your rental experience.",
        "Usage Data: How you interact with our platform, including search history, booking patterns, and preferences.",
        "Driving Data: For certain rentals, we may collect mileage, fuel levels, and vehicle condition reports."
      ]
    },
    {
      title: "2. Your Rights",
      items: [
        "Access: Request a copy of the personal information we hold about your rentals and account.",
        "Correction: Update or correct your driver profile, payment methods, or account details.",
        "Deletion: Request deletion of your account and personal data, subject to legal retention requirements.",
        "Opt-Out: Unsubscribe from marketing emails about special offers and promotions.",
        "Data Portability: Request your rental history and account data in a digital format.",
        "Booking Management: Modify or cancel upcoming reservations through your account."
      ]
    },
    {
      title: "3. Data Sharing",
      items: [
        "With Rental Partners: We share necessary information with our network of car rental providers to fulfill your bookings.",
        "With Payment Processors: Your payment details are securely processed by certified payment service providers.",
        "With Insurance Providers: When you opt for rental insurance, relevant details are shared with our insurance partners.",
        "For Legal Compliance: We may disclose information when required by law, such as for traffic violations or accidents.",
        "With Service Providers: Trusted partners who assist with customer support, IT services, and fraud prevention."
      ]
    },
    {
      title: "4. Security Measures",
      content: "MORENT implements robust security measures to protect your data:",
      items: [
        "Encryption of all sensitive data during transmission and storage",
        "Regular security audits of our systems",
        "Limited employee access to personal information",
        "Secure payment processing compliant with PCI DSS standards",
        "Two-factor authentication for account access"
      ]
    },
    {
      title: "5. Policy Updates",
      content: "We may update this Privacy Policy to reflect changes in our services or legal requirements. Significant changes will be communicated through our platform or via email. The updated version will be indicated by the 'Last Updated' date at the top of this page."
    },
    {
      title: "6. Contact Us",
      content: "For any privacy-related questions or requests, please contact our Data Protection Officer at:",
      contact: [
        "Email: privacy@morent.com",
        "Phone: +1 (800) RENT-NOW",
        "Address: MORENT Privacy Office, 123 Rental Drive, Suite 100, Auto City, CA 90210"
      ]
    }
  ];

  return (
    <section className="pp-section">
      <div className="pp-header">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <h2>Privacy Policy</h2>
        
        <div className="icon-container">
          <div className="settings-dropdown-container" ref={refs.settings}>
            <span className="icon-circle" onClick={() => setState(p => ({...p, showSettingsDropdown: !p.showSettingsDropdown}))}>
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

          <div className="profile-dropdown-container" ref={refs.profile}>
            <div className="profile-pic-container" onClick={() => setState(p => ({...p, showProfileDropdown: !p.showProfileDropdown}))}>
              <img src={state.profilePic} alt="User" className="profile-pic" onError={(e) => e.target.src = defaultProfilePic} />
            </div>
            {state.showProfileDropdown && (
              <div className="profile-dropdown">
                {dropdownItems.profile.map((item, i) => (
                  <div key={i} className={`dropdown-item ${item.className || ''}`} onClick={item.action}>
                    <item.icon className="dropdown-icon" />
                    <span className="dropdown-text">{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pp-content-container">
        <div className="pp-content">
          <p>{privacyContent[0].intro}</p>
          
          {privacyContent.slice(1).map((section, index) => (
            <div key={index}>
              <h3>{section.title}</h3>
              {section.content && <p>{section.content}</p>}
              {section.items && (
                <ul>
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {section.contact && (
                <div className="contact-info">
                  {section.contact.map((info, i) => (
                    <p key={i}><strong>{info.split(':')[0]}:</strong> {info.split(':')[1]}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PP;