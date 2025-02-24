import React from "react";
import Header from "../components/Header";
import LocationSelector from "../components/LocationSelector"; 
import Categories from "../components/Categories";
// import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

const Filter = () => {
  return (
    <div>
      <Header />
      <LocationSelector />
      <Categories />
      {/* <Footer /> */}
    </div>
  );
};

export default Filter;
