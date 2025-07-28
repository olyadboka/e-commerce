import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "./common/header";
import Footer from "./common/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CSS/cart.css"; // Pro version CSS

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCartItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://e-commerce-7-20zw.onrender.com/cart/my-cart`,
        {
          withCredentials: true,
        }
      );

      setCartItems(response.data.data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      const status = err.response?.status;

      setError(errorMessage);
      toast.error(errorMessage);

      if (status === 401) {
        navigate("/login", { state: { from: "/cart" } });
      } else if (status === 404) {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 100) return;

    try {
      await axios.put(
        `http://localhost:3333/cart/${cartItemId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success("Cart updated successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
      fetchCartItems();
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== cartItemId)
      );

      await axios.delete(`http://localhost:3333/cart/${cartItemId}`, {
        withCredentials: true,
      });
      toast.success("Item removed from cart");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
      fetchCartItems();
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:3333/cart/clear-cart`, {
        withCredentials: true,
      });
      setCartItems([]);
      toast.success("Cart cleared successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
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

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="cart-spinner"></div>
      </div>
    );
  }

  return (
    <div className="cart-pro-container">
      <Header />
      <main className="cart-pro-main">
        <h1 className="cart-pro-title">Your Shopping Cart</h1>

        {error && !loading && (
          <div className="cart-pro-error">
            {error}
            <button className="cart-pro-retry" onClick={fetchCartItems}>
              Try Again
            </button>
          </div>
        )}

        {!error && cartItems.length === 0 ? (
          <div className="cart-pro-empty">
            <h2>Your cart is empty</h2>
            <Link to="/products" className="cart-pro-continue-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-pro-content">
            <div className="cart-pro-items">
              <div className="cart-pro-card">
                <div className="cart-pro-card-header">
                  <h2>Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="cart-pro-clear-btn"
                    disabled={cartItems.length === 0}
                  >
                    Clear Cart
                  </button>
                </div>
                <div className="cart-pro-card-body">
                  {cartItems.map((item) => (
                    <div key={item._id} className="cart-pro-item">
                      <div className="cart-pro-item-img">
                        <img
                          src={
                            item.productId?.image ||
                            "https://via.placeholder.com/150"
                          }
                          alt={item.productId?.name || "Product"}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                      <div className="cart-pro-item-details">
                        <h3>{item.productId?.name || "Unnamed Product"}</h3>
                        <p className="cart-pro-item-brand">
                          {item.productId?.brand || "No brand"}
                        </p>
                        <p className="cart-pro-item-price">
                          ${item.productId?.price?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                      <div className="cart-pro-item-quantity">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          disabled={item.quantity >= 100}
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-pro-item-remove">
                        <button onClick={() => removeItem(item._id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="cart-pro-summary">
              <div className="cart-pro-summary-card">
                <h2>Order Summary</h2>
                <div className="cart-pro-summary-row">
                  <span>
                    Subtotal (
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                    items)
                  </span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="cart-pro-summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="cart-pro-summary-divider"></div>
                <div className="cart-pro-summary-total">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
                <Link
                  to="/checkout"
                  className="cart-pro-checkout-btn"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Link>
                <Link to="/products" className="cart-pro-shopping-btn">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
