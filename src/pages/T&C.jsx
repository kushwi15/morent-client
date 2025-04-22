import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPhoneAlt, FaUser, FaFileAlt, FaBook, FaGift, FaSignOutAlt,
  FaCog, FaCommentDots, FaQuestionCircle, FaClipboardList,
  FaShieldAlt, FaInfoCircle
} from "react-icons/fa";
import defaultProfilePic from "../assets/profile.png";
import "../styles/T&C.css";

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api";

const TC = () => {
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

  // Terms content
  const termsContent = [
    "In addition to the vehicle are the following is included in the car rental: All tires, tools, documents, accessories as well as equipment. The renter agrees to all conditions and terms printed on this contract and to the information written on the contract with the same number and date as these car rental terms.",
    {
      items: [
        "The renter fully agrees to the terms and conditions of this contract and has received a copy thereof.",
        "The renter has received the mentioned vehicle and its accessories in proper and safe condition.",
        "The renter agrees to return the vehicle to the lessor on the agreed date and place, as written in the contract, or earlier if the lessor so insists. Should the vehicle not be returned on the agreed time, a fee equal to 1/3 of the daily rate shall be charged for each hour of delay.",
        "SUPER CDW-CDW covers damages to the rental vehicle; it waives liability in case of any damages to the vehicle in excess of ISK 220.000 for 2wd and ISK 330.000 for 4wd and vans. But when you take Super CDW you change that to ISK 100.000 for 2wd and 160.000 ISK for 4wd and vans. Super CDW is available for ISK 1300,- per day. But no insurance covers damages to the underside of the car.",
        "Any violation of Icelandic law, or of any of the terms or conditions of this contract, by the renter or any other driver within the renter has granted permission to operate or drive the vehicle, renders the renter is fully responsible for all damages done to the vehicle what ever the cause may be.",
        "The number of kilometers (km) the vehicle is driven while this contract is valid is decided by reading the standard km reading device (speedometer) attached to the vehicle by the manufacturer. Renter shall report immediately if the speedometer is not working or seizes to function during the rental period.",
        "Lessor shall not be liable for disappearance or damage to any property left, stored or transported by renter or other persons, in or on the vehicle, either before or after it has been returned to lessor.",
        {
          text: "Renter agrees to pay lessor on demand:",
          subItems: [
            "Deposit of the probable rental cost.",
            "All expenses incurred by lessor in returning the vehicle back to lessor's station, if it has been left somewhere else, regardless of condition of the vehicle, roads or weather",
            "A sum equal to the value of all the tires (regardless of road conditions), the tools and accessories which have been damaged, but at stolen from the vehicle."
          ]
        },
        "Renter is not authorized to have the vehicle or its accessories repaired or altered. The renter shall not permit any lien to be placed upon the vehicle without lessors prior consent. Renter shall pay all unauthorized charges in connection with the use, repairs, or safekeeping of the vehicle."
      ]
    }
  ];

  return (
    <section className="tc-section">
      <div className="tc-header">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <h2>Terms & Conditions</h2>
        
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

      <div className="tc-content-container">
        <div className="tc-content">
          <p>{termsContent[0]}</p>
          <ol>
            {termsContent[1].items.map((item, index) => (
              <li key={index}>
                {typeof item === 'string' ? item : (
                  <>
                    {item.text}
                    <ol type="a">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>{subItem}</li>
                      ))}
                    </ol>
                  </>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TC;