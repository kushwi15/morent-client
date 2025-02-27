// CarList.js
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCars } from "../api/carService.js";
import { FaHeart, FaGasPump, FaUserFriends } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import carImage1 from "../assets/car1.png"; // Default car image
import "../styles/CarList.css";

const CarList = ({ isCategoriesPage = false, filters = {}, showMore = 8 }) => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [likedCars, setLikedCars] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carData = await getCars();
        setCars(carData);
      } catch (error) {
        console.error("Error fetching car data:", error);
        setCars([]);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    let result = cars;

    if (filters.type) {
      result = result.filter((car) => car.type === filters.type);
    }

    if (filters.capacity && filters.capacity.length > 0) {
      result = result.filter((car) => filters.capacity.includes(car.seatingCapacity));
    }

    if (filters.maxPrice) {
      result = result.filter((car) => 99 + cars.indexOf(car) <= filters.maxPrice);
    }

    setFilteredCars(result);
  }, [cars, filters]);

  const toggleLike = (index) => {
    setLikedCars((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

    const handleImageLoad = (event) => {
        event.target.classList.add('loaded');
    };

  return (
    <div className="car-list-container">
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

      <div className="car-list">
        {filteredCars.slice(0, showMore).map((car, index) => (
          <div key={index} className="car-card">
            <span className={`like-icon ${likedCars[index] ? "liked" : ""}`} onClick={() => toggleLike(index)}>
              <FaHeart />
            </span>

            <img
              src={car.image || carImage1}
              alt={car.title}
              className="car-image"
              onLoad={handleImageLoad}
            />

            <h5>{car.title}</h5>

            <div className="card-footer">
              <p className="price">Price: ₹{1000 + cars.indexOf(car)} / day</p>
              <button className="btn-rent">Rent Now</button>
            </div>

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
        {filteredCars.length === 0 && <p>No cars found.</p>}
      </div>
    </div>
  );
};

export default CarList;