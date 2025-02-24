import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword"; // Import your ForgotPassword component
import Home from "../pages/Home";
import Filter from "../pages/Filter";
import 'bootstrap/dist/css/bootstrap.min.css';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/filter" element={<Filter />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
