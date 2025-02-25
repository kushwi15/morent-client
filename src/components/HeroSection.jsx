import "react";
import "../styles/HeroSection.css";
import carImage1 from "../assets/car1.png"; // Image for first card

const HeroSection = () => {
  return (
    <div className="hero-section">
      {/* First Card */}
      <div className="card card-primary">
        <div className="card-content">
          <h3>The Best Platform <br /> for Car Rental</h3>
          <p>Ease of doing a car rental safely and<br /> reliably at a low price.</p>
          <button className="btn-rent">Rental Car</button>
        </div>
        <div className="hero-image-container">
          <img src={carImage1} alt="Car Rental" className="hero-image" />
        </div>
      </div>

      {/* Second Card */}
      <div className="card card-secondary">
        <div className="card-content">
          <h3>Easy way to rent a<br /> car at a low price</h3>
          <p>Providing cheap car rental services<br />and safe and comfortable facilities.</p>
          <button className="btn-rent">Rental Car</button>
        </div>
        <div className="hero-image-container">
          <img src={carImage1} alt="Car Rental" className="hero-image" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
