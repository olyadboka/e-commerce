import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer
      className="text-white pt-5 pb-4 mt-5 "
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        boxShadow: "0 4px 18px rgba(0, 0, 0, 0.25)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div
        className="container"
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          boxShadow: "0 4px 18px rgba(0, 0, 0, 0.25)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="row">
          {/* Brand & Social */}
          <div className="col-md-3 mb-4">
            <h5
              className="fw-bold mb-3 text-primary"
              style={{
                background: "linear-gradient(to right, #FF0000FF, #ff4e50)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <i className="bi bi-bag-heart-fill me-2"></i>ShopZone
            </h5>
            <p className="small">Your one-stop shop for everything you need.</p>
            <div className="d-flex gap-2">
              <a
                href="#"
                className="text-white fs-5 bg-primary rounded-circle p-2 d-inline-block shadow-sm"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="#"
                className="text-white fs-5 bg-info rounded-circle p-2 d-inline-block shadow-sm"
              >
                <i className="bi bi-twitter"></i>
              </a>
              <a
                href="#"
                className="text-white fs-5 bg-danger rounded-circle p-2 d-inline-block shadow-sm"
              >
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <h5
              className="fw-bold mb-3 text-primary"
              style={{
                background: "linear-gradient(to right, #FF0000FF, #ff4e50)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Quick Links
            </h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none">
                  <i className="bi bi-house-door me-2"></i>Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/productlist"
                  className="text-white text-decoration-none"
                >
                  <i className="bi bi-box-seam me-2"></i>Products
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-white text-decoration-none">
                  <i className="bi bi-people me-2"></i>About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/contactus"
                  className="text-white text-decoration-none"
                >
                  <i className="bi bi-envelope me-2"></i>Contact
                </Link>
              </li>
            </ul>
          </div>
          {/* Customer Service */}
          <div className="col-md-3 mb-4">
            <h5
              className="fw-bold mb-3 text-primary"
              style={{
                background: "linear-gradient(to right, #FF0000FF, #ff4e50)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Customer Service
            </h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/faq" className="text-white text-decoration-none">
                  <i className="bi bi-question-circle me-2"></i>FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/shipping"
                  className="text-white text-decoration-none"
                >
                  <i className="bi bi-truck me-2"></i>Shipping Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/returns" className="text-white text-decoration-none">
                  <i className="bi bi-arrow-counterclockwise me-2"></i>Return
                  Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="text-white text-decoration-none">
                  <i className="bi bi-shield-lock me-2"></i>Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div className="col-md-3 mb-4">
            <h5
              className="fw-bold mb-3 text-primary"
              style={{
                background: "linear-gradient(to right, #FF0000FF, #ff4e50)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Newsletter
            </h5>
            <p className="small">
              Subscribe to get updates on new arrivals and special offers.
            </p>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control border-0 shadow-sm"
                placeholder="Your email"
                style={{ borderRadius: "20px 0 0 20px" }}
              />
              <button
                className="btn btn-primary px-4"
                type="button"
                style={{ borderRadius: "0 20px 20px 0" }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <hr className="my-4 border-light" />
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <p className="mb-0 small">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-primary">ShopZone</span>. All rights
              reserved.By Olyad Boka
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span className="me-2 small">Payment methods:</span>
            <i className="bi bi-credit-card mx-1 fs-5 text-warning"></i>
            <i className="bi bi-paypal mx-1 fs-5 text-info"></i>
            <i className="bi bi-currency-bitcoin mx-1 fs-5 text-warning"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
