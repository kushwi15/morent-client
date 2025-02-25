import { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import "../styles/LocationSelector.css";

const LocationSelector = () => {
  const [isPickup, setIsPickup] = useState(true);
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

  // Swap Locations Functionality
  const handleSwap = () => {
    setPickupLocation(dropoffLocation);
    setDropoffLocation(pickupLocation);
  };

  return (
    <div className="location-selector">
      {/* Pick-Up Section */}
      <div className={`location-card ${isPickup ? "selected" : ""}`}>
        <label>
          <input
            type="radio"
            name="tripType"
            checked={isPickup}
            onChange={() => setIsPickup(true)}
          />
          <span className="title">Pick – Up</span>
        </label>

        <div className="input-group">
          <div>
            <label>Location</label>
            <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
              <option value="">Select your city</option>
              {cities.map((city, index) => (
                <option key={index} value={city} disabled={city === dropoffLocation}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
          <div>
            <label>Time</label>
            <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>
              <option value="">Select Time</option>
              {timeOptions.map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <button className="swap-btn" onClick={handleSwap}>
        <FaExchangeAlt />
      </button>

      {/* Drop-Off Section */}
      <div className={`location-card ${!isPickup ? "selected" : ""}`}>
        <label>
          <input
            type="radio"
            name="tripType"
            checked={!isPickup}
            onChange={() => setIsPickup(false)}
          />
          <span className="title">Drop – Off</span>
        </label>

        <div className="input-group">
          <div>
            <label>Location</label>
            <select value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)}>
              <option value="">Select your city</option>
              {cities.map((city, index) => (
                <option key={index} value={city} disabled={city === pickupLocation}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Date</label>
            <input
              type="date"
              value={dropoffDate}
              min={pickupDate} // Ensures drop-off is not before pickup
              onChange={(e) => setDropoffDate(e.target.value)}
            />
          </div>
          <div>
            <label>Time</label>
            <select value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)}>
              <option value="">Select Time</option>
              {timeOptions.map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
