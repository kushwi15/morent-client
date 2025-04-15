import { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import "../styles/LocationSelector.css";

const LocationSelector = () => {
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");

  const cities = [
    "New York", "Los Angeles", "Chicago", "Houston", "Miami",
    "Dallas", "San Francisco", "Seattle", "Boston", "Denver"
  ];

  const generateTimeOptions = () => {
    const times = [];
    const periods = ["AM", "PM"];
    for (let period of periods) {
      for (let hour = 1; hour <= 12; hour++) {
        for (let minute of ["00", "15", "30", "45"]) {
          times.push(`${hour.toString().padStart(2, "0")}:${minute} ${period}`);
        }
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Swap pickup & dropoff locations
  const handleSwap = () => {
    setPickupLocation(dropoffLocation);
    setDropoffLocation(pickupLocation);
  };

  return (
    <div className="location-selector">
      {/* Pick-Up Section */}
      <div className="location-card">
        <label>
          <span className="title">Pick-Up</span>
        </label>
        <div className="input-group">
          {/* Pickup Location */}
          <div>
            <label>Location</label>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            >
              <option value="">Select your city</option>
              {cities.map((city, index) => (
                <option key={index} value={city} disabled={city === dropoffLocation}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Pickup Date */}
          <div>
            <label>Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => {
                setPickupDate(e.target.value);
                if (dropoffDate && new Date(e.target.value) > new Date(dropoffDate)) {
                  setDropoffDate("");
                }
              }}
            />
          </div>

          {/* Pickup Time */}
          <div>
            <label>Time</label>
            <select
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            >
              <option value="">Select Time</option>
              {timeOptions.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <button className="swap-btn" onClick={handleSwap} title="Swap Locations">
        <FaExchangeAlt />
      </button>

      {/* Drop-Off Section */}
      <div className="location-card">
        <label>
          <span className="title">Drop-Off</span>
        </label>
        <div className="input-group">
          {/* Dropoff Location */}
          <div>
            <label>Location</label>
            <select
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
            >
              <option value="">Select your city</option>
              {cities.map((city, index) => (
                <option key={index} value={city} disabled={city === pickupLocation}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Dropoff Date */}
          <div>
            <label>Date</label>
            <input
              type="date"
              value={dropoffDate}
              min={pickupDate}
              onChange={(e) => setDropoffDate(e.target.value)}
            />
          </div>

          {/* Dropoff Time */}
          <div>
            <label>Time</label>
            <select
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
            >
              <option value="">Select Time</option>
              {timeOptions.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
