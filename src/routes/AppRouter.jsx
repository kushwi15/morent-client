import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Login from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Home from "../pages/Home";
import Filter from "../pages/Filter";
import ProfilePage from "../pages/ProfilePage";
import 'bootstrap/dist/css/bootstrap.min.css';
import Homeguest from "../pages/Home guest";

 
const AppRouter = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/guest" element={<Homeguest />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};
 
export default AppRouter;
 