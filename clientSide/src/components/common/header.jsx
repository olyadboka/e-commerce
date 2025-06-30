import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

const Header = () => {
  return (
    <header className="bg-gradient bg-dark text-white sticky-top shadow-lg">
      <div className="container py-2">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container-fluid">
            <Link
              className="navbar-brand fw-bold fs-2 d-flex align-items-center"
              to="/"
            >
              <i className="bi bi-bag-check-fill me-2 text-warning"></i>
              ShopZone
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto ms-3">
                <li className="nav-item">
                  <Link className="nav-link active" to="/">
                    <i className="bi bi-house-door me-1"></i>Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/productlist">
                    <i className="bi bi-box-seam me-1"></i>Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">
                    <i className="bi bi-info-circle me-1"></i>About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contactus">
                    <i className="bi bi-envelope me-1"></i>Contact
                  </Link>
                </li>
              </ul>
              <div className="d-flex align-items-center">
                <Link
                  to="/cart"
                  className="btn btn-outline-warning me-2 position-relative"
                >
                  <i className="bi bi-cart3 me-1"></i> Cart
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    0
                  </span>
                </Link>
                <Link to="/login" className="btn btn-warning fw-bold">
                  <i className="bi bi-person-circle me-1"></i> Login
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
