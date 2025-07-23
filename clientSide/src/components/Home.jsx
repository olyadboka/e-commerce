import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import Header from "./common/header";
import Footer from "./common/footer";
import "./CSS/home.css";

const Home = () => {
  // State management
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories data
  const categories = [
    {
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      description: "Cutting-edge gadgets and devices",
    },
    {
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
      description: "Trendy apparel and accessories",
    },
    {
      name: "Home & Kitchen",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      description: "Everything for your living space",
    },
    {
      name: "Beauty",
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
      description: "Premium self-care products",
    },
    {
      name: "Books",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
      description: "Expand your knowledge",
    },
  ];

  // Fetch featured products
  const fetchFeaturedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`${import.meta.env.VITE_BACKEND_URL}`);
      const response = await axios.get(
        `http://localhost:3333/products/featured`
      );

      setFeaturedProducts(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load featured products"
      );
      console.error("Featured products fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  // Loading component
  const renderLoading = () => (
    <div className="loading-state">
      <div className="spinner-grow text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="loading-text">Loading our featured collection...</p>
    </div>
  );

  // Error component
  const renderError = () => (
    <div className="error-state">
      <div className="error-icon">
        <i className="bi bi-exclamation-octagon-fill"></i>
      </div>
      <h3 className="error-heading">Oops! Something went wrong</h3>
      <p className="error-message">{error}</p>
      <button className="retry-button" onClick={fetchFeaturedProducts}>
        <i className="bi bi-arrow-clockwise"></i> Try Again
      </button>
    </div>
  );

  // Category card component
  const CategoryCard = React.memo(({ category }) => (
    <Link
      to={`/productlist?category=${category.name}`}
      className="category-card-link"
    >
      <div className="category-card">
        <div className="category-image-container">
          <img
            src={`${category.image}?auto=format&fit=crop&w=600&q=80`}
            alt={category.name}
            className="category-image"
            loading="lazy"
          />
          <div className="category-overlay"></div>
        </div>
        <div className="category-content">
          <h3 className="category-title">{category.name}</h3>
          <p className="category-description">{category.description}</p>
          <span className="category-cta">
            Shop Now <i className="bi bi-arrow-right"></i>
          </span>
        </div>
      </div>
    </Link>
  ));

  CategoryCard.propTypes = {
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  };

  // Product card component
  const ProductCard = React.memo(({ product }) => (
    <div className="product-card">
      <div className="product-image-container">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        ) : (
          <div className="image-placeholder">
            <i className="bi bi-image"></i>
          </div>
        )}
        {product.quantity <= 0 && (
          <div className="out-of-stock-badge">Sold Out</div>
        )}
      </div>

      <div className="product-details">
        <div className="product-meta">
          <span className="product-brand">{product.brand || "Generic"}</span>
          <span className="product-rating">
            <i className="bi bi-star-fill"></i> 4.8
          </span>
        </div>

        <h3 className="product-title">{product.name}</h3>

        <div className="product-footer">
          <div className="price-container">
            <span className="current-price">${product.price?.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <Link
            to={`/productdetails/${product._id}`}
            className="view-details-button"
            aria-label={`View details for ${product.name}`}
          >
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  ));

  ProductCard.propTypes = {
    product: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      brand: PropTypes.string,
      price: PropTypes.number,
      originalPrice: PropTypes.number,
      quantity: PropTypes.number,
      images: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  };

  return (
    <>
      <Header />

      <main className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-logo">
              <i className="bi bi-shop"></i>
            </div>
            <h1 className="hero-title">
              Welcome to{" "}
              <span className="brand-name">Olyad-Boka Shop Center</span>
            </h1>
            <p className="hero-subtitle">
              Discover premium products at unbeatable prices
            </p>
            <Link to="/productlist" className="hero-button">
              <i className="bi bi-bag me-2"></i> Start Shopping
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">
                Explore our wide range of product categories
              </p>
            </div>

            <div className="categories-grid">
              {categories.map((category, index) => (
                <CategoryCard key={index} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">
                Handpicked selections just for you
              </p>
            </div>

            {loading ? (
              renderLoading()
            ) : error ? (
              renderError()
            ) : featuredProducts.length > 0 ? (
              <div className="products-grid">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <i className="bi bi-box-seam"></i>
                <h3>No Featured Products Available</h3>
                <p>Check back later for our special selections</p>
              </div>
            )}
          </div>
        </section>

        {/* Promo Banner */}
        <section className="promo-banner">
          <div className="container">
            <div className="promo-content">
              <h2 className="promo-title">Summer Sale Event</h2>
              <p className="promo-text">
                Up to <span className="highlight">50% OFF</span> on selected
                items
              </p>
              <Link to="/productlist" className="promo-button">
                <i className="bi bi-lightning-fill me-2"></i> Shop Deals
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
