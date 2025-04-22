import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCar, FaMapMarkerAlt, FaShieldAlt, FaClock, 
  FaHeadset, FaInfoCircle, FaCog, FaUser,
  FaFileAlt, FaBook, FaGift, FaSignOutAlt,
  FaCommentDots, FaQuestionCircle, FaClipboardList,
  FaPhoneAlt
} from 'react-icons/fa';
import "../styles/AboutUs.css";
import googplay from "../assets/google-play-badge.webp";
import appstore from "../assets/app-store-badge.webp";
import defaultProfilePic from "../assets/profile.png";

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api";

const AboutUs = () => {
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

  // Data
  const TESTIMONIALS = [
    {
      quote: "Used MORENT in Goa for a week. Flawless experience from booking to drop-off. Will rent again!",
      author: "Arjun S., Goa Vacation",
      rating: "★★★★★"
    },
    {
      quote: "Monthly rental in Delhi saved me from metro crowds. Well-maintained cars and excellent service.",
      author: "Neha G., Delhi Resident",
      rating: "★★★★☆"
    },
    {
      quote: "Perfect SUV for our Ladakh road trip. MORENT's all-India permit made border crossings easy.",
      author: "Rohit M., Adventure Traveler",
      rating: "★★★★★"
    }
  ];

  const FLEET_CATEGORIES = [
    {
      title: "Economy Cars",
      description: "Fuel-efficient options perfect for city commuting",
      price: "Starting from ₹999/day",
      iconClass: "compact",
      badge: "Most Popular"
    },
    {
      title: "Premium Sedans",
      description: "For business travel or comfortable family trips",
      price: "Starting from ₹1,799/day",
      iconClass: "sedan"
    },
    {
      title: "SUVs & Crossovers",
      description: "Spacious cabins for groups and rough terrain",
      price: "Starting from ₹2,499/day",
      iconClass: "suv",
      badge: "Adventure Ready"
    },
    {
      title: "Luxury Segment",
      description: "Make special occasions unforgettable",
      price: "Starting from ₹4,999/day",
      iconClass: "luxury"
    }
  ];

  const FEATURES = [
    {
      icon: <FaShieldAlt className="feature-icon" />,
      title: "Certified Quality",
      description: "Every vehicle undergoes rigorous 150-point inspection and sanitization"
    },
    {
      icon: <FaClock className="feature-icon" />,
      title: "Flexible Durations",
      description: "Rent by hour, day, week, or month with transparent pricing"
    },
    {
      icon: <FaHeadset className="feature-icon" />,
      title: "24/7 Roadside Assistance",
      description: "Help is just a call away, anywhere in India"
    },
    {
      icon: <FaMapMarkerAlt className="feature-icon" />,
      title: "Nationwide Network",
      description: "Pick-up/drop-off at multiple convenient locations"
    }
  ];

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

  return (
    <div className="about-us-container">
      {/* Header Section */}
      <header className="about-header">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <h2>About Us</h2>

        <div className="icon-container">
          {/* Settings Dropdown */}
          <div className="settings-dropdown-container" ref={refs.settings}>
            <span 
              className="icon-circle" 
              onClick={() => setState(p => ({...p, showSettingsDropdown: !p.showSettingsDropdown}))}
              aria-label="Settings"
              role="button"
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
              role="button"
            >
              <img 
                src={state.profilePic} 
                alt="User profile" 
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
      </header>

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <section className="aboutmain-section">
          <div className="aboutmain-content">
            <h1>Your Journey, Your Rules – Premium Cars, Effortless Rentals</h1>
            <p>Freedom to explore, comfort to enjoy—experience the road like never before with MORENT.</p>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section">
          <div className="about-content">
            <h2>Welcome to MORENT</h2>
            <p>
              MORENT is revolutionizing car rentals across India with our commitment to quality, 
              convenience, and customer satisfaction.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>The MORENT Advantage</h2>
          <div className="features-grid">
            {FEATURES.map((feature, index) => (
              <div className="feature-card" key={`feature-${index}`}>
                {feature.icon}
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fleet Section */}
        <section className="fleet-section">
          <h2>Our Diverse Fleet</h2>
          <div className="fleet-grid">
            {FLEET_CATEGORIES.map((category, index) => (
              <div className="vehicle-card" key={`fleet-${index}`}>
                {category.badge && <div className="vehicle-badge">{category.badge}</div>}
                <FaCar className={`vehicle-icon ${category.iconClass}`} />
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <div className="sample-models">{category.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <h2>Travelers Love MORENT</h2>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((testimonial, index) => (
              <div className="testimonial-card" key={`testimonial-${index}`}>
                <p>{testimonial.quote}</p>
                <div className="customer-info">
                  <strong>{testimonial.author}</strong>
                  <div className="rating">{testimonial.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Explore?</h2>
          <div className="app-badges">
            <img 
              src={googplay} 
              alt="Get on Google Play" 
              loading="lazy" 
              width="135"
              height="40"
            />
            <img 
              src={appstore} 
              alt="Download on App Store" 
              loading="lazy"
              width="135"
              height="40"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;