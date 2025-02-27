/* eslint-disable no-unused-vars */
// filter.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Filter.css";
import CarList from "../components/CarList";
import Header from "../components/Header";
import LocationSelector from "../components/LocationSelector";

const Filter = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState([]);
  const [maxPrice, setMaxPrice] = useState(100000); // Set initial state to 1 lakh
  const [filters, setFilters] = useState({
    type: null,
    capacity: [],
    maxPrice: 100000, // Set initial filters maxPrice to 1 lakh
  });
  const [showMore, setShowMore] = useState(8);
  const navigate = useNavigate();

  const handleCapacityChange = (capacity) => {
    setSelectedCapacity((prev) =>
      prev.includes(capacity) ? prev.filter((c) => c !== capacity) : [...prev, capacity]
    );
  };

  const applyFilters = () => {
    setFilters({
      type: selectedType,
      capacity: selectedCapacity,
      maxPrice: maxPrice,
    });
    setShowMore(8);
  };

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedCapacity([]);
    setMaxPrice(100000); // Reset maxPrice to 1 lakh
    setFilters({ type: null, capacity: [], maxPrice: 100000 }); // Reset filters maxPrice to 1 lakh
    setShowMore(8);
  };

  const handleShowMore = () => {
    setShowMore((prevShowMore) => prevShowMore + 8);
  };

  const handleShowLess = () => {
    setShowMore((prevShowMore) => Math.max(8, prevShowMore - 8));
  };

  return (
    <div className="categories-page">
      <Header />

      <div className="categories-layout">
        <aside className="sidebar">
          <h3>Type</h3>
          <ul>
            {["Sport", "SUV", "MPV", "Sedan", "Coupe", "Hatchback"].map((type) => (
              <li key={type}>
                <input
                  type="radio"
                  name="type"
                  checked={selectedType === type}
                  onChange={() => setSelectedType(type)}
                />
                {type}
              </li>
            ))}
          </ul>

          <h3>Capacity</h3>
          <ul>
            {["2 Person", "4 Person", "6 Person", "8 or More"].map((capacity) => (
              <li key={capacity}>
                <input
                  type="checkbox"
                  checked={selectedCapacity.includes(capacity)}
                  onChange={() => handleCapacityChange(capacity)}
                />
                {capacity}
              </li>
            ))}
          </ul>

          <h3>Price</h3>
          <input
            type="range"
            min="1000" // Min set to 1000
            max="100000" // Max set to 1 lakh
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          />
          <p>Max: ₹{maxPrice}</p>

          <button className="btn-apply" onClick={applyFilters}>
            Apply Filter
          </button>
          <button className="btn-clear" onClick={clearFilters}>
            Clear Filters
          </button>
        </aside>

        <main className="main-content">
          <button className="btn-back" onClick={() => navigate("/home")}>
            ← Back
          </button>
          <div className="carlist-location-container">
            <LocationSelector />
            <CarList isCategoriesPage={true} filters={filters} showMore={showMore} />
          </div>
          <div className="show-more-container">
            {showMore > 8 && (
              <button className="btn-show-less" onClick={handleShowLess}>
                Show Less
              </button>
            )}
            <button className="btn-show-more" onClick={handleShowMore}>
              Show More
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Filter;