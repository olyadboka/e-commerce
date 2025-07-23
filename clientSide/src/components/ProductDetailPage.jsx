import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./common/header";
import Footer from "./common/footer";
import Related from "./related";
import "dotenv";
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Function to get cookie value
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    console.log(document.cookie);
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const addToCart = async () => {
    const token = getCookie("token");

    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login", {
        state: { from: `/products/${id}` },
        replace: true,
      });
      return;
    }

    if (!product) return;

    setIsAddingToCart(true);

    try {
      await axios.post(
        `http://localhost:3333/cart/${product._id}`,
        {
          quantity: 1,
          price: product.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Add to cart error:", err);
      setError(err.response?.data?.message || "Failed to add to cart");
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: `/products/${id}` } });
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      console.log(`http://localhost:3333/products/${id}`);
      try {
        const response = await axios.get(
          `http://localhost:3333/products/${id}`
        );
        setProduct(response.data.data);
        if (response.data.data.images?.length > 0) {
          setMainImage(response.data.data.images[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-5">Loading product details...</div>;
  }
  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }
  if (!product) {
    return <div className="alert alert-info">Product not found</div>;
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
                src={mainImage}
                alt={product.name}
                className="img-fluid rounded"
                style={{
                  maxHeight: "500px",
                  width: "100%",
                  objectFit: "contain",
                  backgroundColor: "white",
                  padding: "10px",
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
                  //  {console.log(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-6 mt-5 ">
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
      <h2>Related Products</h2>
      <Related category={product.category} />
      <Footer />
    </div>
  );
};

export default ProductDetails;
