//Package Import

// import React from "react";
// import { Helmet } from "react-helmet";
import { Route, Routes } from "react-router-dom";

//Style Import
import "./App.css";

//Screen Import
import Home from "./screens/Home";
import { Error } from "./screens/Error";
import { AboutUs } from "./screens/AboutUs";
import { ContactUs } from "./screens/ContactUs";
import HelpSupport from "./screens/HelpSupport";
import DeliveryPolicies from "./screens/DeliveryPolicies";
import PrivacyPolicies from "./screens/PrivacyPolicies";
import TermsOfService from "./screens/TermsOfService";
import Deals from "./screens/Deals";
import BulkOrder from "./screens/BulkOrder";
import Subscription from "./screens/Subscription";
import { Navebar } from "./components/Navebar";
import { Footer } from "./components/Footer";
import Promotion from "./components/Promotion";
import ScrollToTop from "./components/ScrollToTop";
import { Products } from "./screens/Products";
import { ShoppingCart } from "./screens/ShoppingCart";
import Checkout from "./screens/Checkout";

function App() {
  return (
    <>
      <ScrollToTop />
      <Navebar />
      <hr />
      <Routes onUpdate={() => window.scrollTo(0, 0)}>
        <Route index path="/" element={<Home />} />
        <Route index path="/products" element={<Products />} />
        <Route
          index
          path="/products/:short-by-catalogue"
          element={<Products />}
        />
        <Route
          index
          path="/products/:short-by-catalogue/:name"
          element={<Products />}
        />
        <Route exact path="/shopping-cart" element={<ShoppingCart />} />
        <Route exact path="/checkout" element={<Checkout />} />
        <Route exact path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/delivery-policies" element={<DeliveryPolicies />} />
        <Route path="/privacy-policies" element={<PrivacyPolicies />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/bulk-order" element={<BulkOrder />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/error" element={<Error />} />
        <Route path="" element={<Products />} />
        <Route path="*" element={<Products />} />
      </Routes>
      <Promotion />
      <hr />
      <Footer />
      <hr />
    </>
  );
}

export default App;
