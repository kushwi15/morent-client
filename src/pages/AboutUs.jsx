import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCar, FaMapMarkerAlt, FaShieldAlt, FaClock, 
  FaHeadset, FaInfoCircle, FaCity, FaCog, FaUser,
  FaFileAlt, FaBook, FaGift, FaSignOutAlt,
  FaCommentDots, FaQuestionCircle, FaClipboardList,
  FaPhoneAlt
} from 'react-icons/fa';
import "../styles/AboutUs.css";
import googplay from "../assets/google-play-badge.webp";
import appstore from "../assets/app-store-badge.webp";

// ==============================================================================
// CONSTANTS & CONFIGURATION
// ==============================================================================

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api";

// ==============================================================================
// DATA
// ==============================================================================

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

// ==============================================================================
// COMPONENT
// ==============================================================================

const AboutUs = () => {
  // ============================================================================
  // STATE & REFS
  // ============================================================================
  
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('/default-profile.png');
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  
  const profileDropdownRef = useRef(null);
  const settingsDropdownRef = useRef(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    fetchProfileData();

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

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.user_id) {
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

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

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

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="about-us-container">
      {/* Header Section */}
      <header className="about-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2>About Us</h2>

        <div className="icon-container">
          {/* Settings Dropdown */}
          <div className="settings-dropdown-container" ref={settingsDropdownRef}>
            <span 
              className="icon-circle" 
              onClick={() => setShowSettingsDropdown((prev) => !prev)}
              aria-label="Settings"
              role="button"
            >
              <FaCog />
            </span>
            {showSettingsDropdown && renderSettingsDropdown()}
          </div>

          {/* Profile Dropdown */}
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <div 
              className="profile-pic-container" 
              onClick={() => setShowProfileDropdown((prev) => !prev)}
              aria-label="User profile"
              role="button"
            >
              <img 
                src={profilePic} 
                alt="User profile" 
                className="profile-pic" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-profile.png';
                }}
              />
            </div>
            {showProfileDropdown && renderProfileDropdown()}
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
              convenience, and customer satisfaction. Whether you're in bustling metros, growing 
              tier-2 cities, or exploring scenic routes, we deliver mobility solutions tailored 
              to your needs.
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
          <p>Wherever you're going, get there with MORENT</p>
          <div className="cta-buttons">
            <button className="primary-cta">Book Your Vehicle</button>
            <button className="secondary-cta">Download Our App</button>
          </div>
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