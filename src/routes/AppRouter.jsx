import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import Login from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Home from "../pages/Home";
import Filter from "../pages/Filter";
import ProfilePage from "../pages/ProfilePage";
import Homeguest from "../pages/HomeGuest";
import FAQ from "../pages/FAQ";
import TC from "../pages/T&C";
import PP from "../pages/Policy";
import ContactUs from "../pages/ContactUs";
import AboutUs from "../pages/AboutUs";
import OwnerprofilePage from "../pages/OwnerProfilePage"

// OWNER DASHBOARD
import OwnerDashboard from "../pages/OwnerDashboard";
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Optional: Protect routes that require authentication
 */
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Example auth check
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/guest" element={<Homeguest />} />
          <Route path="/filter" element={<ProtectedRoute element={<Filter />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/t&c" element={<TC />} />
          <Route path="/privacypolicy" element={<PP />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />


          {/* OWNER DASHBOARD */}
          <Route path="/owner-dashboard" element={<ProtectedRoute element={<OwnerDashboard />} />} />
          <Route path="/owner-profile" element={<ProtectedRoute element={<OwnerprofilePage />} />} />

        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRouter;
