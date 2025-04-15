import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCars } from "../api/carService.js";
import { FaHeart, FaGasPump, FaUserFriends } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import carImage1 from "../assets/car1.png";
import "../styles/CarList.css";

const CarList = ({ isCategoriesPage = false, filters = {}, showMore = 8 }) => {
  const [cars, setCars] = useState([]);
  const [likedCars, setLikedCars] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carData = await getCars();
        // Add price to each car (500 + index * 100)
        const carsWithPrice = carData.map((car, index) => ({
          ...car,
          price: 500 + (index * 100)
        }));
        setCars(carsWithPrice);
      } catch (error) {
        console.error("Error fetching car data:", error);
        setCars([]);
      }
    };
    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Type filter
    if (filters.type) {
      result = result.filter((car) => 
        car.type.toLowerCase() === filters.type.toLowerCase()
      );
    }

    // Capacity filter
    if (filters.capacity && filters.capacity.length > 0) {
      result = result.filter((car) => {
        const capacityMap = {
          "2 Person": "2 People",
          "4 Person": "4 People",
          "6 Person": "6 People",
          "8 or More": "8 People"
        };
        return filters.capacity.some(cap => 
          car.seatingCapacity === capacityMap[cap]
        );
      });
    }

    // Price filter
    if (filters.maxPrice) {
      result = result.filter((car) => car.price <= filters.maxPrice);
    }

    return result;
  }, [cars, filters.type, filters.capacity, filters.maxPrice]);

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
            <span 
              className={`like-icon ${likedCars[index] ? "liked" : ""}`} 
              onClick={() => toggleLike(index)}
            >
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
              <p className="price">Price: ₹{car.price} / day</p>
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
        {filteredCars.length === 0 && (
          <p className="no-results">No cars match your filters.</p>
        )}
      </div>
    </div>
  );
};

export default CarList;