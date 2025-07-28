import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "./common/header";
import Footer from "./common/footer";
import Related from "./related";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://e-commerce-7-20zw.onrender.com/products/${id}`
      );
      setProduct(response.data.data);
      if (response.data.data.images?.length > 0) {
        setMainImage(response.data.data.images[0]);
      }
      setTotalPrice(response.data.data.price); // Initialize total price
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const addToCart = async () => {
    if (!product) return;
    if (product.quantity <= 0) {
      toast.warning("This product is out of stock");
      return;
    }

    setIsAddingToCart(true);

    try {
      const response = await axios.post(
        `https://e-commerce-7-20zw.onrender.com/cart/cart/${product.id}`,
        {
          quantity,
          price: totalPrice,
        },
        { withCredentials: true }
      );

      toast.success(
        `${quantity} ${quantity > 1 ? "items" : "item"} of ${product.name} added to cart!`
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to add to cart";

      if (err.response?.status === 401) {
        toast.error("Please login to add items to cart");
        navigate("/login", {
          state: { from: `/products/${id}` },
          replace: true,
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 100) {
      toast.info("Maximum quantity per item is 100");
      return;
    }
    if (product && newQuantity > product.quantity) {
      toast.info(`Only ${product.quantity} available in stock`);
      return;
    }
    setQuantity(newQuantity);
    setTotalPrice(product.price * newQuantity);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          Error: {error}
          <button className="btn btn-link" onClick={fetchProduct}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container my-5">
        <div className="alert alert-info">Product not found</div>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div
      className="container-fluid px-0"
      style={{
        fontFamily: "Arial, sans-serif",
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        marginTop: "4rem",
      }}
    >
      <Header />
      <div className="container my-5 flex-grow-1">
        <div className="row">
          {/* Product Images */}
          <div className="col-md-6">
            <div className="mb-3">
              <img
                src={mainImage || "https://via.placeholder.com/500"}
                alt={product.name}
                className="img-fluid rounded"
                style={{
                  maxHeight: "500px",
                  width: "100%",
                  objectFit: "contain",
                  backgroundColor: "white",
                  padding: "10px",
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/500";
                }}
              />
            </div>
            <div className="d-flex flex-wrap gap-2">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className="img-thumbnail cursor-pointer"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    border:
                      img === mainImage
                        ? "2px solid #ff4e50"
                        : "1px solid #ddd",
                  }}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-6 mt-5">
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
                ${totalPrice.toFixed(2)} ({quantity} × $
                {product.price.toFixed(2)})
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
              <span
                className={`badge ${product.quantity > 0 ? "bg-success" : "bg-danger"}`}
              >
                {product.quantity > 0
                  ? `In Stock (${product.quantity})`
                  : "Out of Stock"}
              </span>
            </div>

            {product.quantity > 0 && (
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">
                  Quantity:
                </label>
                <div className="input-group" style={{ maxWidth: "150px" }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    id="quantity"
                    value={quantity}
                    min="1"
                    max={Math.min(100, product.quantity)}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value) || 1)
                    }
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= Math.min(100, product.quantity)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              style={{
                background: "linear-gradient(to right, #FF0000FF, #ff4e50)",
                border: "none",
              }}
              onClick={addToCart}
              disabled={product.quantity <= 0 || isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Adding...
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus me-2"></i>
                  {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <h2 className="container">Related Products</h2>
      <Related category={product.category} currentProductId={id} />
      <Footer />
    </div>
  );
};

export default ProductDetails;
