import React from "react";
import Header from "../components/Header";
import LocationSelector from "../components/LocationSelector"; 
import Categories from "../components/Categories";
import "bootstrap/dist/css/bootstrap.min.css";

const Filter = () => {
  return (
    <div>
      <Header />
      <LocationSelector />
      <Categories />
    </div>
  );
};

export default Filter;
