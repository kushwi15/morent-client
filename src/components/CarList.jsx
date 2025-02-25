import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCars } from "../api/carService.js";
import { FaHeart, FaGasPump, FaUserFriends } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import carImage1 from "../assets/car1.png"; // Default car image
import "../styles/CarList.css";

const CarList = ({ isCategoriesPage = false }) => {
  const [cars, setCars] = useState([]);
  const [likedCars, setLikedCars] = useState({});
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carData = await getCars();
        setCars(carData.slice(0, 16));
      } catch (error) {
        console.error("Error fetching car data:", error);
        setCars([]); // Prevent crashes by setting an empty array
      }
    };
    fetchCars();
  }, []);

  const toggleLike = (index) => {
    setLikedCars((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="car-list-container">
      {/* Hide buttons when on Categories Page */}
      {!isCategoriesPage && (
        <div className="car-list-header">
          <div className="left-section">
            <button className="btn-popular">Popular</button>
          </div>
          <div className="right-section">
            <button className="btn-view-all" onClick={() => navigate("/Filter")}>
              View All
            </button>
          </div>
        </div>
      )}

      {/* Car Cards */}
      <div className="car-list">
        {(showAll ? cars : cars.slice(0, 8)).map((car, index) => (
          <div key={index} className="car-card">
            {/* Like Icon */}
            <span className={`like-icon ${likedCars[index] ? "liked" : ""}`} onClick={() => toggleLike(index)}>
              <FaHeart />
            </span>

            {/* Car Image */}
            <img src={car.image || carImage1} alt={car.title} className="car-image" />

            {/* Car Title */}
            <h5>{car.title}</h5>

            {/* Price & Rent Button */}
            <div className="card-footer">
              <p className="price">Price: ${99 + index} / day</p>
              <button className="btn-rent">Rent Now</button>
            </div>

            {/* Car Info Icons */}
            <div className="car-info">
              <span className="info-item">
                <FaGasPump /> {car.fuelCapacity || "90L"}
              </span>
              <span className="info-item">
                <GiCarWheel /> {car.transmission || "Manual"}
              </span>
              <span className="info-item">
                <FaUserFriends /> {car.seatingCapacity || "6 People"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Show Less Button (Hidden in Categories Page) */}
      {!isCategoriesPage && (
        <div className="show-more-container">
          <button className="btn-show-more" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CarList;
