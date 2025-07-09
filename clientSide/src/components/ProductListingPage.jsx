import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.BACKEND_URL}/api/products`
        );
        setProducts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return <div className="text-center py-5">Loading products...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Our Products</h2>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {products.map((product) => (
          <div key={product.id} className="col">
            <div className="card h-100 shadow-sm">
              {/* Display first image as main product image */}
              {product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: "250px", objectFit: "cover" }}
                />
              )}

              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">{product.brand}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="h5 text-primary">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className="badge bg-secondary">
                    {product.quantity} in stock
                  </span>
                </div>
              </div>

              <div className="card-footer bg-transparent">
                <Link
                  to={`/products/${product.id}`}
                  className="btn btn-primary w-100"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
