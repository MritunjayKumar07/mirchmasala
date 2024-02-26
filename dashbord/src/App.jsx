import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Product } from "./components/products/Product";
import SideNavBar from "./components/sideNavebar/SideNaveBar";
import TopNavBar from "./components/topNavebar/TopNaveBar";
import Dashboard from "./pages/Dashbord";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useEffect, useState } from "react";
import OTPValidate from "./pages/OTPValidate";
import ApiError from "./pages/ErroHandling/ApiError";
import UpdatePassword from "./pages/UpdatePassword";
import UpdateUserName from "./pages/UpdateUserName";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [localStorage.getItem("userInfo")]);

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
    <div className="flex justify-center">
      <Routes onUpdate={() => window.scrollTo(0, 0)}>
        <Route index path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-validate/:email" element={<OTPValidate />} />
        <Route path="/api-error/:code" element={<ApiError />} />
        <Route path="*" element={<ApiError />} />
      </Routes>
    </div>
  );
}

export default App;
