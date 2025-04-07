import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaSave, FaCamera, FaTrash } from "react-icons/fa";
import axios from "axios";
import "../styles/ProfilePage.css";
import DefaultPic from "../assets/profile.png";

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://morent-gjjg.onrender.com/api";

const ProfilePage = () => {
  // State Management
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  // Refs and Navigation
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Helper Functions
  const extractFilename = (path) => {
    if (!path) return null;
    return path.split('/').pop();
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // Effect Hooks
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser._id) {
          setUserData(parsedUser);
        } else {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (userData && userData._id) {
      setFormData(prev => ({
        ...prev,
        userId: userData._id,
        name: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phoneNumber || "",
      }));
    }
  }, [userData]);

  useEffect(() => {
    return () => {
      Object.values(formData).forEach(value => {
        if (value instanceof File && value.preview) {
          URL.revokeObjectURL(value.preview);
        }
      });
    };
  }, [formData]);

  useEffect(() => {
    fetchProfileData();
  }, [userData?._id]);

  // Data Fetching
  const fetchProfileData = async () => {
    if (!userData?._id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/profile/${userData._id}`,
        { headers: getAuthHeaders() }
      );

      if (response.data) {
        setProfile(response.data);
        setFormData(prev => ({
          ...prev,
          ...response.data,
          userId: userData._id
        }));
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        setError("Failed to load profile data");
      }
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file)
      });
      setFormData(prev => ({ ...prev, [field]: fileWithPreview }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!formData.userId) {
        alert("User ID is missing");
        return;
      }
  
      setLoading(true);
      setError(null);
  
      const formDataToSend = new FormData();
      formDataToSend.append('userId', formData.userId);
  
      const nonFileFields = ['name', 'dob', 'address', 'city', 'state', 'zipCode', 'country'];
      nonFileFields.forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });
  
      const fileFields = ['profilePic', 'aadhaarFront', 'aadhaarBack', 'panCard', 'passport', 'driversLicense'];
      fileFields.forEach(field => {
        if (formData[field] instanceof File) {
          formDataToSend.append(field, formData[field]);
        } else if (formData[field] && typeof formData[field] === 'string') {
          formDataToSend.append(field, formData[field]);
        }
      });
  
      const config = {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      };
  
      const url = profile 
        ? `${API_BASE_URL}/profile/${formData.userId}`
        : `${API_BASE_URL}/profile`;
  
      const method = profile ? 'patch' : 'post';
  
      const response = await axios[method](url, formDataToSend, config);
  
      const updatedProfileData = response.data.profile || response.data;
  
      setProfile(updatedProfileData);
      setFormData(prev => ({
        ...prev,
        ...updatedProfileData,
        ...fileFields.reduce((acc, field) => {
          if (formData[field] instanceof File) {
            acc[field] = formData[field];
          }
          return acc;
        }, {})
      }));
  
      setEditMode(false);

      //  window.location.reload();   // Optional: Reload the page to reflect changes
  
    } catch (error) {
      console.error("Save error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          "Failed to save profile";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfilePic = async () => {
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('userId', formData.userId);
      formDataToSend.append('profilePic', '');
      
      const config = {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      };
  
      await axios.patch(
        `${API_BASE_URL}/profile/${formData.userId}`,
        formDataToSend,
        config
      );
  
      setFormData(prev => ({ ...prev, profilePic: null }));
      
      if (profile) {
        setProfile(prev => ({ ...prev, profilePic: null }));
      }
      
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      setError("Failed to delete profile picture");
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => navigate("/home");

  // Render Helpers
  const renderProfileImage = () => {
    const imageUrl = formData.profilePic instanceof File
      ? formData.profilePic.preview
      : formData.profilePic
      ? `${API_BASE_URL.replace('/api', '')}/uploads/${formData.profilePic}`
      : DefaultPic;

    return (
      <img
        src={imageUrl}
        alt="Profile"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = DefaultPic;
        }}
      />
    );
  };

  const renderDocumentImage = (key) => {
    if (!formData[key]) return null;
    
    return (
      <img
        src={
          formData[key] instanceof File
            ? formData[key].preview
            : `${API_BASE_URL.replace('/api', '')}/uploads/${formData.userId}/${extractFilename(formData[key])}?${Date.now()}`
        }
        alt={key}
        onError={(e) => {
          // e.target.src = DefaultPic;
          console.error(`Failed to load ${key} image:`, formData[key]);
        }}
      />
    );
  };

  // Loading and Error States
  if (loading && !profile) return <div className="profile-modal-overlay">Loading...</div>;

  if (error) return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <div className="error-message">{error}</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal" ref={modalRef}>
        {/* Header Section */}
        <div className="profile-header">
          <FaArrowLeft className="back-btn" onClick={onClose} />
          <h2>Profile Details</h2>
          <button 
            className="edit-btn" 
            onClick={() => editMode ? handleSave() : setEditMode(true)}
            disabled={loading}
          >
            {loading ? "Saving..." : editMode ? <FaSave /> : <FaEdit />}
          </button>
        </div>

        {/* Profile Picture Section */}
        <div className="profile-picture">
          {renderProfileImage()}
          {editMode && (
            <div className="file-upload">
              <label>
                <FaCamera />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profilePic")}
                  disabled={loading}
                />
              </label>
              {formData.profilePic && (
                <button
                  className="remove-btn"
                  onClick={handleDeleteProfilePic}
                  disabled={loading}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Fields Section */}
        <div className="profile-fields">
          {[
            { label: "Name", key: "name", type: "text", required: true },
            { label: "Date of Birth", key: "dob", type: "date" },
            { label: "Phone Number", key: "phone", type: "tel", readOnly: true },
            { label: "Email", key: "email", type: "email", required: true, readOnly: true },
            { label: "Address", key: "address", type: "text" },
            { label: "City", key: "city", type: "text" },
            { label: "State", key: "state", type: "text" },
            { label: "Zip Code", key: "zipCode", type: "text" },
            { label: "Country", key: "country", type: "text" },
          ].map(({ label, key, type, required, readOnly }) => (
            <div key={key}>
              <label>
                {label}:
                {required && <span className="required-field">*</span>}
              </label>
              <input
                type={type}
                name={key}
                value={formData[key] || ""}
                onChange={handleInputChange}
                disabled={!editMode || loading}
                required={required}
                readOnly={readOnly}
                className={readOnly ? "read-only-field" : ""}
              />
            </div>
          ))}
        </div>

        {/* Documents Section */}
        <h3>Uploaded Documents</h3>
        <div className="document-upload">
          {["aadhaarFront", "aadhaarBack", "panCard", "passport", "driversLicense"].map((key) => (
            <div key={key} className="document-section">
              <label>{key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}:</label>
              {renderDocumentImage(key)}
              {editMode && (
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, key)} 
                  disabled={loading}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default ProfilePage;