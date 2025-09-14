import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./common/header";
import Footer from "./common/footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CSS/checkout.css";

const CheckOutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Ethiopia",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://e-commerce-7-20zw.onrender.com/cart/my-cart`,
        { withCredentials: true }
      );
      setCartItems(response.data.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: "/checkout" } });
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce(
        (total, item) => total + (item.productId?.price || 0) * item.quantity,
        0
      )
      .toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setProcessing(true);

      const response = await axios.post(
        `https://e-commerce-7-20zw.onrender.com/payment/create-order`,
        {
          shippingAddress: formData,
          notes: "Order placed via checkout page",
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Redirect to Chapa payment page
        window.location.href = response.data.data.checkoutUrl;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
      console.error("Checkout error:", err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="checkout-spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <Header />
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checking out</p>
          <button
            className="checkout-continue-btn"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <Header />
      <main className="checkout-main">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order securely with Chapa payment</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="checkout-section">
                <h2>Shipping Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? "error" : ""}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <span className="error-text">{errors.firstName}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? "error" : ""}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <span className="error-text">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "error" : ""}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <span className="error-text">{errors.email}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? "error" : ""}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <span className="error-text">{errors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? "error" : ""}
                    placeholder="Enter your street address"
                  />
                  {errors.address && (
                    <span className="error-text">{errors.address}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? "error" : ""}
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <span className="error-text">{errors.city}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State/Region *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={errors.state ? "error" : ""}
                      placeholder="Enter your state"
                    />
                    {errors.state && (
                      <span className="error-text">{errors.state}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={errors.zipCode ? "error" : ""}
                      placeholder="Enter ZIP code"
                    />
                    {errors.zipCode && (
                      <span className="error-text">{errors.zipCode}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Tanzania">Tanzania</option>
                  </select>
                </div>
              </div>

              <div className="checkout-section">
                <h2>Payment Method</h2>
                <div className="payment-method">
                  <div className="payment-option selected">
                    <div className="payment-icon">
                      <img
                        src="https://chapa.co/img/chapa-logo.svg"
                        alt="Chapa"
                      />
                    </div>
                    <div className="payment-info">
                      <h3>Chapa Payment</h3>
                      <p>
                        Secure payment with mobile money, bank transfer, and
                        cards
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="checkout-actions">
                <button
                  type="button"
                  className="checkout-back-btn"
                  onClick={() => navigate("/cart")}
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="checkout-pay-btn"
                  disabled={processing}
                >
                  {processing
                    ? "Processing..."
                    : `Pay $${calculateTotal()} with Chapa`}
                </button>
              </div>
            </form>
          </div>

          <div className="checkout-summary">
            <div className="checkout-summary-card">
              <h2>Order Summary</h2>
              <div className="checkout-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="checkout-item">
                    <div className="checkout-item-image">
                      <img
                        src={
                          item.productId?.image ||
                          "https://via.placeholder.com/60"
                        }
                        alt={item.productId?.name || "Product"}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/60";
                        }}
                      />
                    </div>
                    <div className="checkout-item-details">
                      <h4>{item.productId?.name || "Unnamed Product"}</h4>
                      <p>Qty: {item.quantity}</p>
                      <p className="checkout-item-price">
                        ${(item.productId?.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-totals">
                <div className="checkout-total-row">
                  <span>
                    Subtotal (
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                    items)
                  </span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="checkout-total-row checkout-total-final">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckOutPage;
