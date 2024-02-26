import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Product } from "./components/products/Product";
import SideNavBar from "./components/sideNavebar/SideNaveBar.jsx";
import TopNavBar from "./components/topNavebar/TopNaveBar.jsx";
import Dashboard from "./pages/Dashbord.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { useState } from "react";
import OTPValidate from "./pages/OTPValidate.jsx";
import ApiError from "./pages/ErroHandling/ApiError.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import UpdateUserName from "./pages/UpdateUserName.jsx";

function App() {
  // const [isLogdIn, setIsLogdIn] = useState(true);
  const [isLogdIn, setIsLogdIn] = useState(false);
  return (
    <div>
      {isLogdIn ? (
        <div className="flex">
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
        </div>
      ) : (
        <div className="flex justify-center">
          <Routes onUpdate={() => window.scrollTo(0, 0)}>
            <Route index path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/otp-validate/:email" element={<OTPValidate />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/update-username" element={<UpdateUserName />} />
            <Route path="/api-error/:code" element={<ApiError />} />
            <Route path="*" element={<ApiError />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
