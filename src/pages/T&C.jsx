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
import "../styles/T&C.css";

// Define the base API URL
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api";

const TC = () => {
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
        <span className="dropdown-text">Write Feedback</span>
      </div>
      <div className="dropdown-item" onClick={() => navigate("/faq")}>
        <FaQuestionCircle className="dropdown-icon" />
        <span className="dropdown-text">FAQ</span>
      </div>
      <div className="dropdown-item" onClick={() => navigate("/t&c")}>
        <FaClipboardList className="dropdown-icon" />
        <span className="dropdown-text">Terms & Conditions</span>
      </div>
      <div className="dropdown-item" onClick={() => navigate("/privacypolicy")}>
        <FaShieldAlt className="dropdown-icon" />
        <span className="dropdown-text"> Privacy Policy</span>
      </div>
      <div className="dropdown-item" onClick={() => navigate("/about")}>
        <FaInfoCircle className="dropdown-icon" />
        <span className="dropdown-text">About Us</span>
      </div>
      <div className="dropdown-item" onClick={() => navigate("/contact")}>
        <FaPhoneAlt className="dropdown-icon" />
        <span className="dropdown-text">Contact Us</span>
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
    <div className="tc-content">
      <p>
        In addition to the vehicle are the following is included in the car rental: All tires, tools, documents, 
        accessories as well as equipment. The renter agrees to all conditions and terms printed on this contract 
        and to the information written on the contract with the same number and date as these car rental terms.
      </p>

      <ol>
        <li>The renter fully agrees to the terms and conditions of this contract and has received a copy thereof.</li>
        <li>The renter has received the mentioned vehicle and its accessories in proper and safe condition.</li>
        <li>
          The renter agrees to return the vehicle to the lessor on the agreed date and place, as written in the contract, 
          or earlier if the lessor so insists. Should the vehicle not be returned on the agreed time, a fee equal to 1/3 
          of the daily rate shall be charged for each hour of delay.
        </li>
        <li>
          SUPER CDW-CDW covers damages to the rental vehicle; it waives liability in case of any damages to the vehicle 
          in excess of ISK 220.000 for 2wd and ISK 330.000 for 4wd and vans. But when you take Super CDW you change that 
          to ISK 100.000 for 2wd and 160.000 ISK for 4wd and vans. Super CDW is available for ISK 1300,- per day. But no 
          insurance covers damages to the underside of the car.
        </li>

        <li>
          Any violation of Icelandic law, or of any of the terms or conditions of this contract, by the renter or any 
          other driver within the renter has granted permission to operate or drive the vehicle, renders the renter is 
          fully responsible for all damages done to the vehicle what ever the cause may be.
        </li>
        <li>
          The number of kilometers (km) the vehicle is driven while this contract is valid is decided by reading the 
          standard km reading device (speedometer) attached to the vehicle by the manufacturer. Renter shall report 
          immediately if the speedometer is not working or seizes to function during the rental period.
        </li>
        <li>
          Lessor shall not be liable for disappearance or damage to any property left, stored or transported by renter 
          or other persons, in or on the vehicle, either before or after it has been returned to lessor.
        </li>
        <li>
          Renter agrees to pay lessor on demand:
          <ol type="a">
            <li>Deposit of the probable rental cost.</li>
            <li>
              All expenses incurred by lessor in returning the vehicle back to lessor's station, if it has been left 
              somewhere else, regardless of condition of the vehicle, roads or weather.
            </li>
            <li>
              A sum equal to the value of all the tires (regardless of road conditions), the tools and accessories 
              which have been damaged, but at stolen from the vehicle.
            </li>
          </ol>
        </li>
        <li>
          Renter is not authorized to have the vehicle or its accessories repaired or altered. The renter shall not 
          permit any lien to be placed upon the vehicle without lessors prior consent. Renter shall pay all unauthorized 
          charges in connection with the use, repairs, or safekeeping of the vehicle.
        </li>
      </ol>
    </div>
  );

  return (
    <section className="tc-section">
      {/* Header */}
      <div className="tc-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2>Terms & Conditions</h2>

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

      {/* Terms & Conditions Content */}
      <div className="tc-content-container">
        {renderTermsContent()}
      </div>
    </section>
  );
};

export default TC;