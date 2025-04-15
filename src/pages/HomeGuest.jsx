import HeroSection from "../components/HeroSection";
import SearchForm from "../components/LocationSelector"; // SearchForm is LocationSelector
import CarList from "../components/CarList";
import Footer from "../components/Footer";
import HeaderGuest from "../components/HeaderGuest";
import "bootstrap/dist/css/bootstrap.min.css";

const HomeGuest = () => {
  return (
    <div>
      <HeaderGuest />
      <HeroSection />
      <SearchForm />
      <CarList />
      <Footer />
    </div>
  );
};

export default HomeGuest;