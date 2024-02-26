import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Product } from "./components/products/Product";
import SideNavBar from "./components/sideNavebar/SideNaveBar";
import TopNavBar from "./components/topNavebar/TopNaveBar";
import Dashboard from "./pages/Dashbord";
import Login from "./pages/authPage/Login";
import Signup from "./pages/authPage/Signup";
import OTPValidate from "./pages/authPage/OTPValidate";
import ApiError from "./pages/ErroHandling/ApiError";
import UpdatePassword from "./pages/authPage/UpdatePassword";
import UpdateUserName from "./pages/authPage/UpdateUserName";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ValidateAccessToken } from "./Api/ValidationAccessToken";
import UpdateProfilePhoto from "./pages/authPage/UpdateProfilePhoto";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const validateLogin = async () => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      const res = await ValidateAccessToken(accessToken, navigate);
      if (res === 200) {
        setIsLoggedIn(true);
      }
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      validateLogin();
    } else {
      setIsLoggedIn(false);
    }
  }, [Cookies.get("accessToken")]);

  return (
    <div className="flex">
      {isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}
    </div>
  );
}

function LoggedInRoutes() {
  return (
    <>
      <SideNavBar />
      <div className="relative w-full bg-white">
        <TopNavBar />
        <Routes onUpdate={() => window.scrollTo(0, 0)}>
          <Route index path="/" element={<Dashboard />} />
          <Route path="/update-Profile-Photo" element={<UpdateProfilePhoto/>} />
          <Route path="/product" element={<Product />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/update-username" element={<UpdateUserName />} />
          <Route path="/api-error/:code" element={<ApiError />} />
          <Route path="*" element={<ApiError />} />
        </Routes>
      </div>
    </>
  );
}

function LoggedOutRoutes() {
  return (
    <div className="flex justify-center w-full">
      <Routes onUpdate={() => window.scrollTo(0, 0)}>
        <Route path="/" element={<Login />} />
        <Route index path="/signup" element={<Signup />} />
        <Route path="/otp-validate/:email" element={<OTPValidate />} />
        <Route path="/api-error/:code" element={<ApiError />} />
        <Route path="*" element={<ApiError />} />
      </Routes>
    </div>
  );
}

export default App;
