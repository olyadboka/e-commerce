import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "./common/header.jsx";
import Footer from "./common/footer.jsx";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded categories with internet images
  const categories = [
    {
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Fashion",
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Home & Kitchen",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Beauty",
      image:
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Books",
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    },
  ];

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3333/products/featured"
        );
        setFeaturedProducts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div
        className="text-center py-5"
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          boxShadow: "0 4px 18px rgba(0, 0, 0, 0.25)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-3 mt-3">
        <h4>Error loading content</h4>
        <p>{error}</p>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
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
      }}
    >
      <style>{`
        .full-width-section {
          width: 100vw;
          margin-left: 50%;
          transform: translateX(-50%);
          border-radius: 0 !important;
        }
        .category-card {
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
          background: linear-gradient(135deg, #1a1a2e 0%, #283C72FF 50%, #366CAEFF 100%);
          color: white
         border: 1.5px solid #CADAF1FF;
        }
         .card {
         background: linear-gradient(135deg, #1a1a2e 0%, #283C72FF 50%, #366CAEFF 100%);
         color: white
         }
        .category-card:hover {
          transform: translateY(-6px) scale(1.04);
          box-shadow: 0 8px 24px #0d6efd33;
          border: 1.5px solid #CADAF1FF;
         background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
         color: white
        }
        .featured-product-img {
          border-radius: 1rem 1rem 0 0;
          transition: transform 0.2s;
          height: 200px;
          object-fit: cover;
        }
        .card:hover .featured-product-img {
          transform: scale(1.05);
          box-shadow: 0 4px 16px #0d6efd22;
        }
        .featured-product-btn {
          border-radius: 2rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: background 0.2s, color 0.2s;
        }
        .featured-product-btn:hover {
          background: linear-background(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          color: #fff;
        }
        .promo-gradient {
          background: linear-gradient(90deg, #0d6efd 60%, #6610f2 100%);
        }
        .promo-btn {
          border-radius: 2rem;
          font-weight: 700;
          letter-spacing: 1px;
          box-shadow: 0 2px 12px #fff3;
          transition: background 0.2s, color 0.2s;
        }
        .promo-btn:hover {
          background: #fff;
          color: #0d6efd !important;
        }
        @media (max-width: 767px) {
          .category-card img {
            height: 70px !important;
          }
          .featured-product-img {
            height: 120px !important;
          }
          .full-width-section {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }
      `}</style>

      <Header />

      {/* Hero Section */}
      <section
        className="text-center p-5 mb-4 rounded shadow-sm full-width-section"
        style={{
          background: `linear-gradient(rgba(34,34,34,0), rgba(34,34,34,0)), url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') center/cover no-repeat`,
          color: "#fff",
          position: "relative",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxShadow: "0 8px 32px #0d6efd22",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
          alt="Shopping Cart"
          style={{
            width: 90,
            height: 90,
            margin: "0 auto 24px auto",
            background: "rgba(255,255,255,0.18)",
            borderRadius: "50%",
            padding: 18,
            boxShadow: "0 2px 12px #2226",
            border: "2px solid #fff",
          }}
        />
        <h1
          className="display-3 fw-bold"
          style={{ textShadow: "0 2px 12px #222" }}
        >
          Welcome to{" "}
          <span
            style={{
              background: "linear-gradient(to right, #FF0000FF, #ff4e50)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Shopping
          </span>
        </h1>
        <p className="lead fs-4" style={{ textShadow: "0 1px 4px #222" }}>
          Your one-stop shop for everything you need
        </p>
        <Link to="/productlist">
          <button
            className="btn btn-primary btn-lg mt-3 shadow rounded-pill px-5 py-2 fs-5"
            style={{
              background: "linear-gradient(to right, #FF0000FF, #ff4e50)",
            }}
          >
            <i className="bi bi-bag me-2"></i> Shop Now
          </button>
        </Link>
      </section>

      {/* Categories Section */}
      <section className="mt-5 container">
        <h2
          className="mb-4 fw-bold text-primary text-center"
          style={{
            background: "linear-gradient(to right, #FF0000FF, #ff4e50)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Browse by Category
        </h2>
        <div className="row g-4 justify-content-center">
          {categories.map((category, index) => (
            <div className="col-6 col-md-3" key={index}>
              <Link
                to={`/productlist?category=${category.name}`}
                className="text-decoration-none"
              >
                <div className="card h-100 shadow-sm border-0 category-card text-center">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="card-img-top"
                    style={{
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "1rem 1rem 0 0",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-semibold text-dark">
                      {category.name}
                    </h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mt-5 container">
        <h2
          className="mb-4 fw-bold text-success text-center"
          style={{
            background: "linear-gradient(to right, #FF0000FF, #ff4e50)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Featured Products
        </h2>
        <div className="row g-4">
          {featuredProducts.map((product) => (
            <div className="col-12 col-sm-6 col-md-4" key={product._id}>
              <div className="card h-100 shadow-lg border-0">
                {product.images && product.images.length > 0 && (
                  <img
                    src={`${product.images[0]}`}
                    alt={product.name}
                    className="featured-product-img w-100 h-100"
                  />
                )}
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{product.name}</h5>
                  <p
                    className="card-text fw-bold text-primary fs-5"
                    style={{
                      background:
                        "linear-gradient(to right, #FF0000FF, #ff4e50)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ${product.price}
                  </p>
                  <Link to={`/productdetails/${product._id}`}>
                    <button className="btn btn-outline-primary btn-sm featured-product-btn px-4 py-2">
                      <i className="bi bi-eye me-1"></i> View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="mt-5 p-5 promo-gradient text-white text-center rounded shadow-lg full-width-section">
        <h2 className="mb-2 display-6 fw-bold">🎉 Summer Sale is Live!</h2>
        <p className="mb-3 fs-5">
          Up to <span className="fw-bold">50% off</span> on selected items.
          Don't miss out!
        </p>
        <Link to="/productlist">
          <button className="btn btn-light btn-lg text-primary fw-bold promo-btn px-5 py-2">
            <i className="bi bi-stars me-2"></i> Explore Deals
          </button>
        </Link>
      </section>

      <Footer />

      {/* Bootstrap Icons CDN */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />
    </div>
  );
};

export default Home;
