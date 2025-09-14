import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./components/Home";
import About from "./components/About";
import ContactUs from "./components/ContactUs";
import ProductDetails from "./components/ProductDetailPage";
import ProductListing from "./components/ProductListingPage";
import ProfileInfo from "./components/ProfileInfo";

// Auth Pages
import Login from "./components/userAuthentication/LoginPage";
import SignUp from "./components/userAuthentication/RegisterForm";
import ForgotPassword from "./components/userAuthentication/ForgotPassword";
import Admin_dashboard from "./admin_dashbord/admin_dashboard";
import Manage_products from "./admin_dashbord/manage_products";
import Cart from "./components/cart";
import CheckOutPage from "./components/CheckOutPage";
import PaymentSuccess from "./components/PaymentSuccess";
import OrdersPage from "./components/OrdersPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/productdetails/:id" element={<ProductDetails />} />
        <Route path="/productlist" element={<ProductListing />} />
        <Route path="/profile" element={<ProfileInfo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* for Admin dashboard */}
        <Route path="/admin_dashboard" element={<Admin_dashboard />}></Route>
        <Route path="/manage_products" element={<Manage_products />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
