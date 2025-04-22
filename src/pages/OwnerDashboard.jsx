import React from "react";
import OwnerHeader from "../components/OwnerHeader";
// import HeroSection from "../components/HeroSection";
// import SearchForm from "../components/LocationSelector"; 
// import CarList from "../components/CarList";
// import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

const OwnerDashboard = ({ isGuest }) => {
  return (
    <div>
      <OwnerHeader isGuest={isGuest} />
      {/* <HeroSection />  */}
      {/* <SearchForm /> */}
      {/* <CarList /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default OwnerDashboard;