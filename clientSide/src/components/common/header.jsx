import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import "../CSS/header.css";

const Header = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Fetch cart items count
  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    // setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartItemsCount(0);
        return;
      }

      const response = await axios.get("http://localhost:3333/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const totalItems = response.data.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartItemsCount(totalItems);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message);
      if (err.response?.status === 401) {
        setCartItemsCount(0);
        setIsLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
    // Check auth status
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [fetchCartItems, location]);

  // Nav items data
  const navItems = [
    { path: "/", icon: "house-door", label: "Home" },
    { path: "/productlist", icon: "box-seam", label: "Products" },
    { path: "/about", icon: "info-circle", label: "About" },
    { path: "/contactus", icon: "envelope", label: "Contact" },
  ];

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-content">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo">
            <i className="bi bi-shop-window brand-icon"></i>
            <span className="brand-name">Olyad-Boka Shop Center</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <i className={`bi ${mobileMenuOpen ? "bi-x" : "bi-list"}`}></i>
          </button>

          {/* Navigation */}
          <nav className={`main-navigation ${mobileMenuOpen ? "open" : ""}`}>
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                  >
                    <i className={`bi bi-${item.icon}`}></i>
                    {item.label}
                    <span className="nav-link-underline"></span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* User Actions */}
            <div className="user-actions">
              <Link
                to="/cart"
                className="cart-button"
                aria-label="Shopping cart"
              >
                <i className="bi bi-cart3"></i>
                {!loading && cartItemsCount > 0 && (
                  <span className="cart-badge">{cartItemsCount}</span>
                )}
              </Link>

              {isLoggedIn ? (
                <div className="dropdown user-dropdown">
                  <Link to="/login" className="dropdown-item">
                    <button
                      className="user-profile-button"
                      aria-label="User profile"
                    >
                      <i className="bi bi-person-circle"></i>
                    </button>
                  </Link>
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      <i className="bi bi-person me-2"></i> My Profile
                    </Link>
                    <Link to="/orders" className="dropdown-item">
                      <i className="bi bi-receipt me-2"></i> My Orders
                    </Link>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        localStorage.removeItem("token");
                        setIsLoggedIn(false);
                        setCartItemsCount(0);
                      }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="login-button  ">
                  <i className="bi bi-person-circle me-2">Login</i>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
