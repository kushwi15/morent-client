import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaEdit, FaSave, FaCamera, FaTrash } from "react-icons/fa";
import axios from "axios";
import "../styles/ProfilePage.css";
import DefaultPic from "../assets/profile.png";

const ProfilePage = ({ onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    profilePic: "",
    aadhaarFront: "",
    aadhaarBack: "",
    panCard: "",
    passport: "",
    driversLicense: "",
  });
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [field]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  const handleRemoveProfile = () => {
    setFormData((prev) => ({
      ...prev,
      profilePic: "",
    }));
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal" ref={modalRef}>
        <div className="profile-header">
          <FaArrowLeft className="back-btn" onClick={() => window.history.back()} />
          <h2>Profile Details</h2>
        </div>

        <button className="edit-btn" onClick={() => setEditMode((prev) => !prev)}>
          {editMode ? <FaSave onClick={handleSave} /> : <FaEdit />}
        </button>

        <div className="profile-picture">
          <img
            src={formData.profilePic || DefaultPic}
            alt="Profile"
            onError={(e) => { e.target.onerror = null; e.target.src = DefaultPic; }}
          />
          {editMode && (
            <label className="file-upload">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "profilePic")}
              />
              <button className="remove-btn" onClick={handleRemoveProfile}>
                <FaTrash />
              </button>
            </label>
          )}
        </div>

        <div className="profile-fields">
          {[
            { label: "Name", key: "name", type: "text" },
            { label: "Date of Birth", key: "dob", type: "date" },
            { label: "Phone Number", key: "phone", type: "tel" },
            { label: "Email", key: "email", type: "email" },
            { label: "Address", key: "address", type: "text" },
            { label: "City", key: "city", type: "text" },
            { label: "State", key: "state", type: "text" },
            { label: "Zip Code", key: "zipCode", type: "text" },
            { label: "Country", key: "country", type: "text" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label>{label}:</label>
              <input
                type={type}
                name={key}
                value={formData[key] || ""}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
          ))}
        </div>

        <h3>Uploaded Documents</h3>
        <div className="document-upload">
          {[
            { label: "Aadhaar Front", key: "aadhaarFront" },
            { label: "Aadhaar Back", key: "aadhaarBack" },
            { label: "PAN Card", key: "panCard" },
            { label: "Passport", key: "passport" },
            { label: "Driver's License", key: "driversLicense" },
          ].map(({ label, key }) => (
            <div key={key} className="document-section">
              <label>{label}:</label>
              {formData[key] && <img src={formData[key]} alt={label} />}
              {editMode && <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, key)} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;