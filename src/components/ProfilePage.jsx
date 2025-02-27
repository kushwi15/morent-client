import React from "react";
import { FaTimes } from "react-icons/fa";
import "../styles/ProfilePage.css";

const ProfilePage = ({ formData, handleFileChange, onClose }) => {
  return (
    <div className="profile-modal">
      <div className="profile-content">
        <FaTimes className="close-btn" onClick={onClose} />

        <h2>Profile Details</h2>
        <div className="profile-picture">
          <img src={formData.profilePic} alt="Profile" />
          <input type="file" onChange={(e) => handleFileChange(e, "profilePic")} />
        </div>

        <div className="profile-fields">
          <div>
            <label>First Name:</label>
            <input type="text" value={formData.firstName} readOnly />
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" value={formData.lastName} readOnly />
          </div>
          <div>
            <label>Date of Birth:</label>
            <input type="date" value={formData.dob} readOnly />
          </div>
          <div>
            <label>Phone Number:</label>
            <input type="tel" value={formData.phone} readOnly />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" value={formData.email} readOnly />
          </div>
        </div>

        <h3>Documents</h3>
        <div className="document-upload">
          <div>
            <label>Aadhaar Front:</label>
            {formData.aadhaarFront && <img src={formData.aadhaarFront} alt="Aadhaar Front" />}
            <input type="file" onChange={(e) => handleFileChange(e, "aadhaarFront")} />
          </div>
          <div>
            <label>Aadhaar Back:</label>
            {formData.aadhaarBack && <img src={formData.aadhaarBack} alt="Aadhaar Back" />}
            <input type="file" onChange={(e) => handleFileChange(e, "aadhaarBack")} />
          </div>
          <div>
            <label>PAN Card:</label>
            {formData.panCard && <img src={formData.panCard} alt="PAN Card" />}
            <input type="file" onChange={(e) => handleFileChange(e, "panCard")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
