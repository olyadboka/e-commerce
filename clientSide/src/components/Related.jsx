import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/related.css";
import { Link } from "react-router-dom";

const Related = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3333/related/${category}`
        );
        setProducts(response.data.data);
      } catch (error) {
        setError(error.message);
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, [category]);

  if (loading)
    return <div className="loading">Loading related products...</div>;
  if (error)
    return <div className="error">Error loading products: {error}</div>;
  if (!products.length)
    return <div className="empty">No related products found</div>;

  return (
    <section className="related-products">
      <div className="related-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image-container">
              <img
                src={product.images[0] || "/placeholder-image.jpg"}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            </div>
            <div className="product-info">
              <h3 className="product-brand">{product.brand}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-price">${product.price}</div>
              <Link
                to={`/productdetails/${product._id}`}
                className="view-details-button"
                aria-label={`View details for ${product.name}`}
              >
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Related;
