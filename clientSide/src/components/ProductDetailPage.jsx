import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./common/header";
import Footer from "./common/footer";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3333/products/${id}`
        );
        setProduct(response.data.data);
        if (response.data.data.images.length > 0) {
          setMainImage(response.data.data.images[0]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return <div className="text-center py-5">Loading product details...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (!product)
    return <div className="alert alert-info">Product not found</div>;

  return (
    <div
      className="container-fluid px-0"
      style={{
        fontFamily: "Arial, sans-serif",
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",

        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        color: "white",
      }}
    >
      <Header />
      <div className="container my-5">
        <div className="row">
          {/* Product Images */}
          <div className="col-md-6">
            <div className="mb-3">
              <img
                src={mainImage}
                alt={product.name}
                className="img-fluid rounded"
                style={{
                  maxHeight: "500px",
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
            <div className="d-flex flex-wrap gap-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className="img-thumbnail cursor-pointer"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-6">
            <h2>{product.name}</h2>
            <p className="text-muted">{product.brand}</p>

            <div className="d-flex align-items-center mb-3">
              <span
                className="h3 text-primary me-3"
                style={{
                  background: "linear-gradient(to right, #00FF00FF, #ff4e50)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ${product.price.toLocaleString()}
              </span>
              {product.isFeatured && (
                <span className="badge bg-warning text-dark">
                  <i className="bi bi-star-fill me-1"></i> Featured
                </span>
              )}
            </div>

            <p className="mb-4">{product.description}</p>

            <div className="mb-4">
              <span className="badge bg-secondary me-2">
                {product.category}
              </span>
              <span className="badge bg-info">Stock: {product.quantity}</span>
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{
                background: "linear-gradient(to right, #FF0000FF, #ff4e50)",
              }}
            >
              <i className="bi bi-cart-plus me-2"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
