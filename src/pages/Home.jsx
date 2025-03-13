import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import SearchForm from "../components/LocationSelector"; // SearchForm is LocationSelector
import CarList from "../components/CarList";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = ({ isGuest }) => {
  return (
    <div>
      <Header isGuest={isGuest} />
      <HeroSection />
      <SearchForm />
      <CarList />
      <Footer />
    </div>
  );
};

export default Home;