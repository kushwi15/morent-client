import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
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
  FaSearch,
  FaChevronDown 
} from "react-icons/fa";
import defaultProfilePic from "../assets/profile.png";
import "../styles/FAQ.css";

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api";

const FAQ = () => {
  // User profile state
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const settingsDropdownRef = useRef(null);
  const questionsListRef = useRef(null);

  // FAQ state
  const [activeCategory, setActiveCategory] = useState("General");
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [containerHeight, setContainerHeight] = useState('auto');

  // FAQ categories and questions (unchanged from your original code)
  const categories = ["General", "Account", "Payment", "Service"];
  const questions = {
    General: [
      {
        question: "How do I make a Booking?",
        answer: "When you find a Car you want to book, tap out the view that Car stands. Check the photo description, and available options if applicable, and then tap the Add to Car's Button. Follow the questions instructions to complete the Booking including providing function details and payment information."
      },
      {
        question: "What payment methods are accepted?",
        answer: "Credit cards, Debit cards, Upi payment are accepted."
      },
      {
        question: "How do I track my Car?",
        answer: "GPS tracking feature allows you to monitor the vehicle's location, often with real-time updates and alerts."
      },
      {
        question: "How can I contact customer support for assistance?",
        answer: "To contact customer support for assistance, you can typically find a 'Help' or 'Support' section within the app, or visit the company's website to find contact information like phone numbers, email addresses, or live chat options."
      },
      {
        question: "How do I create an account?",
        answer: "To create an account, you'll typically need to download the app, open it, and then follow the registration process, which usually involves providing your email address or phone number, creating a password, and potentially uploading a driver's license and ID."
      }
    ],
    Account: [
      {
        question: "How do I create an account?",
        answer: "You can create an account by visiting the sign-up page and filling out the necessary details like your name, email, and password. Some platforms may also ask for additional information such as phone number or address."
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer: "If you've forgotten your password, click on the 'Forgot Password' link on the login page. You will usually be asked to enter your email address, and a password reset link will be sent to you."
      },
      {
        question: "How do I update my account information?",
        answer: "To update your account information (like email, password, or personal details), log in to your account, go to your account settings, and make the necessary changes."
      },
      {
        question: "Can I delete my account?",
        answer: "Yes, most platforms allow users to delete their accounts. You can typically find this option in the account settings or contact customer support if it's not readily available."
      },
      {
        question: "How do I change my email address?",
        answer: "To change your email address, go to the settings page of your account, look for the email section, and update it with your new email. Some platforms may require you to verify the new email."
      }
    ],
    Payment: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept a variety of payment methods, including credit/debit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and sometimes other methods such as digital wallets (e.g., Apple Pay, Google Pay)."
      },
      {
        question: "How do I update my payment information?",
        answer: "To update your payment information, log in to your account, navigate to the payment or billing section, and select the option to update your payment method or card details."
      },
      {
        question: "Why was my payment declined?",
        answer: "Payments may be declined for several reasons, including insufficient funds, expired or incorrect card information, or security blocks from your bank. You can try using a different payment method or check with your bank for more details."
      },
      {
        question: "Can I change my payment method after making a purchase?",
        answer: "Once a payment is processed, it generally cannot be changed. However, you can cancel the order (if possible) and place a new order with the preferred payment method."
      },
      {
        question: "Is my payment information secure?",
        answer: "Yes, most platforms use encryption and secure payment gateways to protect your payment information. It's always a good idea to make sure you're on a secure connection (HTTPS) when entering payment details."
      },
      {
        question: "Will I be charged taxes on my purchase?",
        answer: "Taxes are applied based on your location, the product or service you're purchasing, and local tax laws. The total tax amount is usually calculated at checkout before you complete the payment."
      },
      {
        question: "Can I get a refund?",
        answer: "Refund policies vary by platform and product. Typically, if the refund request meets the platform's policy (such as within a certain period after purchase), you can get a refund. Contact customer support for assistance."
      }
    ],
    Service: [
      {
        question: "What services do you offer?",
        answer: "We offer a variety of services, including car rentals, vehicle delivery, and premium vehicle options. Please check our services page for a complete list of what we offer."
      },
      {
        question: "How can I book or request a service?",
        answer: "You can book or request a service by visiting our website, choosing the service you're interested in, and filling out the necessary forms or contacting our support team. Some services may also be available directly through our platform."
      },
      {
        question: "How do I know which service is right for me?",
        answer: "If you're unsure which service fits your needs, feel free to contact our customer support team. They can guide you in selecting the best option based on your specific requirements."
      },
      {
        question: "What is the cost of your services?",
        answer: "Our service prices vary depending on the type of service, vehicle model, and rental duration. You can find more detailed pricing information on our website, or you can reach out to us for a custom quote."
      },
      {
        question: "Can I customize the services to fit my needs?",
        answer: "Yes, many of our services are customizable. We work with you to tailor the service to your specific needs. Please contact us for more information or to discuss your requirements."
      },
      {
        question: "How long does it take to complete a service?",
        answer: "The time it takes to complete a service depends on the specific service you're requesting. We provide estimated timelines during the booking or consultation process, and we strive to deliver on or before those dates."
      },
      {
        question: "Do you offer any guarantees on your services?",
        answer: "We offer a satisfaction guarantee for most of our services. If you're not satisfied with the result, we'll work with you to make it right, within the scope of our policies."
      }
    ]
  };

  // Filter questions based on search query
  const filteredQuestions = questions[activeCategory].filter(q =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update container height when questions change
  useEffect(() => {
    if (questionsListRef.current) {
      const height = filteredQuestions.length > 0 
        ? `${questionsListRef.current.scrollHeight}px`
        : '300px';
      setContainerHeight(height);
    }
  }, [filteredQuestions, expandedQuestion]);

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user?._id) {
        setIsGuest(true);
        return;
      }

      setIsGuest(false);

      const { data } = await axios.get(`${API_BASE_URL}/profile/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data?.profilePic) {
        const picUrl = data.profilePic instanceof File 
          ? data.profilePic.preview 
          : `${API_BASE_URL.replace('/api', '')}/uploads/${data.profilePic}`;
        setProfilePic(picUrl);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    
    // Listen for profile updates from other components
    const updateProfile = () => fetchProfile();
    window.addEventListener('profileUpdated', updateProfile);
    return () => window.removeEventListener('profileUpdated', updateProfile);
  }, []);

  useEffect(() => {
    // Close dropdowns when clicking outside
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  // Settings dropdown items
  const settingsItems = [
    { icon: FaCommentDots, text: "Write Feedback", action: () => {} },
    { icon: FaQuestionCircle, text: "FAQ", action: () => navigate("/faq") },
    { icon: FaClipboardList, text: "Terms & Conditions", action: () => navigate("/t&c") },
    { icon: FaShieldAlt, text: "Privacy Policy", action: () => navigate("/privacypolicy") },
    { icon: FaInfoCircle, text: "About Us", action: () => navigate("/about") },
    { icon: FaPhoneAlt, text: "Contact Us", action: () => navigate("/contact") }
  ];

  // Profile dropdown items
  const profileItems = isGuest
    ? [{ icon: FaUser, text: "Login", action: () => navigate("/login") }]
    : [
        { icon: FaUser, text: "My Profile", action: () => navigate("/profile") },
        { icon: FaFileAlt, text: "Documents", action: () => {} },
        { icon: FaBook, text: "Bookings", action: () => {} },
        { icon: FaGift, text: "Rewards", action: () => {} },
        { icon: FaSignOutAlt, text: "Log Out", action: handleLogout, className: "logout-btn" }
      ];

  return (
    <section className="faq-section">
      {/* Header */}
      <div className="faq-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2>FAQ's</h2>

        <div className="icon-container">
          {/* Settings Dropdown */}
          <div className="settings-dropdown-container" ref={settingsDropdownRef}>
            <span className="icon-circle" onClick={() => setShowSettingsDropdown((prev) => !prev)}>
              <FaCog />
            </span>
            {showSettingsDropdown && (
              <div className="settings-dropdown">
                {settingsItems.map((item, i) => (
                  <div key={i} className="dropdown-item" onClick={item.action}>
                    <item.icon className="dropdown-icon" />
                    <span className="dropdown-text">{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <div className="profile-pic-container" onClick={() => setShowProfileDropdown((prev) => !prev)}>
              <img 
                src={profilePic} 
                alt="User" 
                className="profile-pic" 
                onError={(e) => e.target.src = defaultProfilePic}
              />
            </div>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                {profileItems.map((item, i) => (
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

      {/* FAQ Content (unchanged from your original code) */}
      <div className="faq-content-container">
        {/* Category Tabs */}
        <div className="faq-categories">
          {categories.map(category => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(category);
                setExpandedQuestion(null);
                setSearchQuery("");
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="faq-search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for questions..."
            className="faq-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Questions List */}
        <div 
          className="faq-questions-list"
          ref={questionsListRef}
          style={{ height: containerHeight }}
        >
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((item, index) => (
              <div key={index} className="faq-question-item">
                <div 
                  className="faq-question-header"
                  onClick={() => toggleQuestion(index)}
                >
                  <h3>{item.question}</h3>
                  <FaChevronDown 
                    className={`faq-expand-icon ${expandedQuestion === index ? 'expanded' : ''}`} 
                  />
                </div>
                {expandedQuestion === index && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="faq-no-results">
              No questions found matching your search.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQ;