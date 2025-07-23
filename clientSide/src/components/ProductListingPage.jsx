import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "./common/header";
import Footer from "./common/footer";
import "./CSS/productList.css";

const ProductList = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  // API call with error handling
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`http://localhost:3333/products`);

      setProducts(data.data || []);
      // console.log(data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch products. Please try again later."
      );
      console.error("Product fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter and sort products
  const processedProducts = React.useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term)
      );
    }

    switch (sortOption) {
      case "price-asc":
        return result.sort((a, b) => a.price - b.price);
      case "price-desc":
        return result.sort((a, b) => b.price - a.price);
      case "name-asc":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return result.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return result;
    }
  }, [products, searchTerm, sortOption]);

  // Loading state component
  const renderLoading = () => (
    <div className="loading-state">
      <div className="spinner-grow text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="loading-text">Loading our product collection...</p>
    </div>
  );

  // Error state component
  const renderError = () => (
    <div className="error-state">
      <div className="error-icon">
        <i className="bi bi-exclamation-octagon-fill"></i>
      </div>
      <h3 className="error-heading">Oops! Something went wrong</h3>
      <p className="error-message">{error}</p>
      <button className="retry-button" onClick={fetchProducts}>
        <i className="bi bi-arrow-clockwise"></i> Try Again
      </button>
    </div>
  );

  // Empty state component
  const renderEmptyState = () => (
    <div className="empty-state">
      <div className="empty-icon">
        <i className="bi bi-box-seam"></i>
      </div>
      <h3 className="empty-heading">No Products Found</h3>
      <p className="empty-message">
        {searchTerm
          ? `No products match your search for "${searchTerm}"`
          : "Our product catalog is currently empty. Please check back later."}
      </p>
      {searchTerm && (
        <button
          className="clear-search-button"
          onClick={() => setSearchTerm("")}
        >
          Clear Search
        </button>
      )}
    </div>
  );

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
          <span className="product-brand">{product.brand}</span>
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

      <main className="product-list-page">
        <section className="product-list-header">
          <div className="container">
            <div className="header-content">
              <h1 className="page-title">Our Collection</h1>
              <p className="page-subtitle">
                Discover our premium selection of products
              </p>
            </div>
          </div>
        </section>

        <section className="product-list-controls">
          <div className="container">
            <div className="controls-grid">
              <div className="search-control">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="sort-control">
                <label htmlFor="sort-select" className="sort-label">
                  <i className="bi bi-sort-down"></i> Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="sort-select"
                >
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="product-list-main">
          <div className="container">
            {loading ? (
              renderLoading()
            ) : error ? (
              renderError()
            ) : processedProducts.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                <div className="product-count">
                  Showing {processedProducts.length} of {products.length}{" "}
                  products
                </div>

                <div className="product-grid">
                  {processedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProductList;
