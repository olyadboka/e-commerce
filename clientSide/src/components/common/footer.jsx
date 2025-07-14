import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "../CSS/footer.css";

const Footer = () => {
  // Footer sections data
  const footerSections = [
    {
      title: "ShopEase",
      content: (
        <>
          <p className="footer-description">
            Your one-stop shop for everything you need.
          </p>
          <div className="social-links">
            {["facebook", "twitter", "instagram", "linkedin"].map(
              (platform) => (
                <a
                  key={platform}
                  href={`https://${platform}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-link ${platform}`}
                  aria-label={platform}
                >
                  <i className={`bi bi-${platform}`}></i>
                </a>
              )
            )}
          </div>
        </>
      ),
    },
    {
      title: "Quick Links",
      links: [
        { path: "/", icon: "house-door", label: "Home" },
        { path: "/productlist", icon: "box-seam", label: "Products" },
        { path: "/about", icon: "info-circle", label: "About" },
        { path: "/contactus", icon: "envelope", label: "Contact" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { path: "/faq", icon: "question-circle", label: "FAQ" },
        { path: "/shipping", icon: "truck", label: "Shipping" },
        { path: "/returns", icon: "arrow-counterclockwise", label: "Returns" },
        { path: "/privacy", icon: "shield-lock", label: "Privacy" },
      ],
    },
    {
      title: "Newsletter",
      content: (
        <>
          <p className="footer-description">
            Subscribe for updates and special offers.
          </p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Your email"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </>
      ),
    },
  ];

  // Payment methods
  const paymentMethods = [
    "credit-card",
    "paypal",
    "google-pay",
    "apple-pay",
    "currency-bitcoin",
  ];

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {footerSections.map((section, index) => (
            <div key={index} className="footer-section">
              <h3 className="footer-title">{section.title}</h3>
              {section.links ? (
                <ul className="footer-links">
                  {section.links.map((link) => (
                    <li key={link.path} className="footer-link-item">
                      <Link to={link.path} className="footer-link">
                        <i className={`bi bi-${link.icon}`}></i>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                section.content
              )}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            &copy; {new Date().getFullYear()} olyadboka. All rights reserved.
          </div>
          <div className="payment-methods">
            <span className="payment-label">We accept:</span>
            {paymentMethods.map((method) => (
              <i
                key={method}
                className={`bi bi-${method} payment-icon`}
                aria-label={method.replace("-", " ")}
              ></i>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
