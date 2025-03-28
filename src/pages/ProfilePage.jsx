import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaSave, FaCamera, FaTrash } from "react-icons/fa";
import axios from "axios";
import "../styles/ProfilePage.css";
import DefaultPic from "../assets/profile.png";

// Define API base URL once at the top
const API_BASE_URL = "https://morent-gjjg.onrender.com/api";
// const API_BASE_URL = "http://localhost:5000/api"; 

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    profilePic: null,
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
    passport: null,
    driversLicense: null,
  });

  const modalRef = useRef(null);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
    }
  }, []);

  // Update formData when userData is received
  useEffect(() => {
    if (userData && userData.user_id) {
      setFormData((prev) => ({
        ...prev,
        userId: userData.user_id,
        name: userData.name || "",
        dob: userData.dob || "",
        phone: userData.phone || "",
        email: userData.email || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        zipCode: userData.zipCode || "",
        country: userData.country || "",
      }));
    }
  }, [userData]);

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userData?.user_id) return;

      console.log("Fetching profile for user_id:", userData.user_id);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/profile/${userData.user_id}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (response.data) {
          setProfile(response.data);
          setFormData((prev) => ({
            ...prev,
            ...response.data,
          }));
        }
      } catch (error) {
        console.error("Error fetching profile data:", error.response?.data || error.message);
      }
    };

    fetchProfileData();
  }, [userData?.user_id]);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const checkProfile = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/profile/${formData.userId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.status === 200;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      console.error("Error checking profile:", error.response?.data || error.message);
      return false;
    }
  };

  const handleSave = async () => {
    try {
      // Show confirmation popup
      const isConfirmed = window.confirm("Are you sure you want to save the changes?");
      if (!isConfirmed) return;

      const updatedData = new FormData();
      updatedData.append("name", formData.name);
      updatedData.append("dob", formData.dob);
      updatedData.append("phone", formData.phone);
      updatedData.append("email", formData.email);
      updatedData.append("address", formData.address);
      updatedData.append("city", formData.city);
      updatedData.append("state", formData.state);
      updatedData.append("zipCode", formData.zipCode);
      updatedData.append("country", formData.country);

      if (formData.profilePic) updatedData.append("profilePic", formData.profilePic);
      if (formData.aadhaarFront) updatedData.append("aadhaarFront", formData.aadhaarFront);
      if (formData.aadhaarBack) updatedData.append("aadhaarBack", formData.aadhaarBack);
      if (formData.panCard) updatedData.append("panCard", formData.panCard);
      if (formData.passport) updatedData.append("passport", formData.passport);
      if (formData.driversLicense) updatedData.append("driversLicense", formData.driversLicense);

      console.log("Checking if profile exists for ID:", formData.userId);

      const profileExists = await checkProfile();
      let response;

      if (profileExists) {
        response = await axios.put(
          `${API_BASE_URL}/profile/${formData.userId}`,
          updatedData,
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/profile`,
          updatedData,
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      console.log("Profile saved successfully:", response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Error saving profile:", error.response?.data || error.message);
    }
  };

  const onClose = () => {
    navigate("/home");
  };

  const handleDeleteProfile = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/profile/${userData.user_id}`,
        {
          headers: getAuthHeaders(),
        }
      );
      onClose();
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal" ref={modalRef}>
        <div className="profile-header">
          <FaArrowLeft className="back-btn" onClick={onClose} />
          <h2>Profile Details</h2>
        </div>

        <button className="edit-btn" onClick={() => (editMode ? handleSave() : setEditMode(true))}>
          {editMode ? <FaSave /> : <FaEdit />}
        </button>

        <div className="profile-picture">
          <img
            src={
              formData.profilePic instanceof File
                ? URL.createObjectURL(formData.profilePic)
                : formData.profilePic
                ? `${API_BASE_URL.replace('/api', '')}/uploads/${formData.profilePic.replace(/\\/g, "/")}`
                : DefaultPic
            }
          />
          {editMode && (
            <div className="file-upload">
              <label>
                <FaCamera />
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "profilePic")} />
              </label>
              <button className="remove-btn" onClick={handleDeleteProfile}>
                <FaTrash />
              </button>
            </div>
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
          {["aadhaarFront", "aadhaarBack", "panCard", "passport", "driversLicense"].map((key) => (
            <div key={key} className="document-section">
              <label>{key.replace(/([A-Z])/g, " $1")}:</label>

              {formData[key] && (
                <img
                  src={
                    formData[key] instanceof File
                      ? URL.createObjectURL(formData[key])
                      : formData[key]
                      ? `${API_BASE_URL.replace('/api', '')}/uploads/${formData[key].replace(/\\/g, "/")}`
                      : DefaultPic
                  }
                />
              )}
              
              {editMode && <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, key)} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;