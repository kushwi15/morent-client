import HeroSection from "../components/HeroSection";
import SearchForm from "../components/LocationSelector"; // SearchForm is LocationSelector
import CarList from "../components/CarList";
import Footer from "../components/Footer";
import Headerguest from "../components/Header guest";
import "bootstrap/dist/css/bootstrap.min.css";

const Homeguest = () => {
  return (
    <div>
      <Headerguest />
      <HeroSection />
      <SearchForm />
      <CarList />
      <Footer />
    </div>
  );
};

export default Homeguest;