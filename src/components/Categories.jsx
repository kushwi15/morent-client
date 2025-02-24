import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";
import CarList from "../components/CarList";
import Header from "../components/Header";

const Categories = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState([]);
  const [maxPrice, setMaxPrice] = useState(100);
  const [appliedType, setAppliedType] = useState(null);
  const [appliedCapacity, setAppliedCapacity] = useState([]);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(100);
  const navigate = useNavigate();

  // Handle checkbox selections for Capacity
  const handleCapacityChange = (capacity) => {
    setSelectedCapacity((prev) =>
      prev.includes(capacity)
        ? prev.filter((c) => c !== capacity)
        : [...prev, capacity]
    );
  };

  // Apply Filters button click
  const applyFilters = () => {
    setAppliedType(selectedType);
    setAppliedCapacity(selectedCapacity);
    setAppliedMaxPrice(maxPrice);
  };

  return (
    <div className="categories-page">
      <Header />

      <div className="categories-layout">
        {/* Sidebar Filters */}
        <aside className="sidebar">
          {/* Car Type Selection */}
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

          {/* Capacity Selection */}
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

          {/* Price Slider */}
          <h3>Price</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <p>Max: ${maxPrice}</p>

          {/* Apply Filters Button */}
          <button className="btn-apply" onClick={applyFilters}>
            Apply Filter
          </button>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <button className="btn-back" onClick={() => navigate("/home")}>← Back</button>

          {/* Car List Component (Passing Applied Filters) */}
          <CarList
            isCategoriesPage={true}
            selectedType={appliedType}
            selectedCapacity={appliedCapacity}
            maxPrice={appliedMaxPrice}
          />
        </main>
      </div>
    </div>
  );
};

export default Categories;
