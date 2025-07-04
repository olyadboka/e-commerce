import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Header = () => {
  return (
    <header
      className="sticky-top"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        boxShadow: "0 4px 18px rgba(0, 0, 0, 0.25)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="container py-2">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container-fluid px-0">
            <Link
              className="navbar-brand fw-bold fs-3 d-flex align-items-center"
              to="/"
              style={{
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "0.5px",
              }}
            >
              <i
                className="bi bi-shop-window me-2 text-warning"
                style={{ fontSize: "1.5rem" }}
              ></i>
              <span
                style={{
                  background: "linear-gradient(to right, #FF0000FF, #ff4e50)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                inc ShopZone
              </span>
            </Link>

            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i
                className="bi bi-list text-white"
                style={{ fontSize: "1.75rem" }}
              ></i>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mx-auto" style={{ gap: "1rem" }}>
                <li className="nav-item">
                  <Link className="nav-link position-relative px-3 py-2" to="/">
                    <i className="bi bi-house-door me-2"></i>Home
                    <span
                      className="position-absolute bottom-0 start-50 translate-middle-x bg-warning"
                      style={{
                        width: "0",
                        height: "2px",
                        transition: "all 0.3s",
                      }}
                    ></span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link position-relative px-3 py-2"
                    to="/productlist"
                  >
                    <i className="bi bi-box-seam me-2"></i>Products
                    <span
                      className="position-absolute bottom-0 start-50 translate-middle-x bg-warning"
                      style={{
                        width: "0",
                        height: "2px",
                        transition: "all 0.3s",
                      }}
                    ></span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link position-relative px-3 py-2"
                    to="/about"
                  >
                    <i className="bi bi-info-circle me-2"></i>About
                    <span
                      className="position-absolute bottom-0 start-50 translate-middle-x bg-warning"
                      style={{
                        width: "0",
                        height: "2px",
                        transition: "all 0.3s",
                      }}
                    ></span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link position-relative px-3 py-2"
                    to="/contactus"
                  >
                    <i className="bi bi-envelope me-2"></i>Contact
                    <span
                      className="position-absolute bottom-0 start-50 translate-middle-x bg-warning"
                      style={{
                        width: "0",
                        height: "2px",
                        transition: "all 0.3s",
                      }}
                    ></span>
                  </Link>
                </li>
              </ul>

              <div className="d-flex align-items-center gap-3">
                <Link
                  to="/cart"
                  className="btn btn-outline-light position-relative d-flex align-items-center"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(5px)",
                    transition: "all 0.3s",
                    padding: "0.5rem 1rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.2)";
                  }}
                >
                  <i className="bi bi-cart3 me-2"></i> Cart
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    0
                  </span>
                </Link>

                <Link
                  to="/login"
                  className="btn btn-warning fw-bold d-flex align-items-center"
                  style={{
                    borderRadius: "8px",
                    padding: "0.5rem 1.5rem",
                    background: "linear-gradient(to right, #FF0000FF, #ff4e50)",
                    border: "none",
                    boxShadow: "0 4px 8px rgba(249, 212, 35, 0.3)",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 12px rgba(249, 212, 35, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(249, 212, 35, 0.3)";
                  }}
                >
                  <i className="bi bi-person-circle me-2"></i> Login
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <style>
        {`
          .nav-link:hover span {
            width: 70% !important;
          }
          .nav-link.active span {
            width: 70% !important;
            background: #f9d423 !important;
          }
          .navbar-brand:hover {
            transform: scale(1.02);
            transition: transform 0.3s;
          }
        `}
      </style>
    </header>
  );
};

export default Header;
