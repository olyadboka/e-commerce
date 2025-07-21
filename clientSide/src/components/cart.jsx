import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "./common/header";
import Footer from "./common/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3333/cart/my-cart`, {
        withCredentials: true,
      });
      setCartItems(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error(errorMessage);
      console.log(" Error: ", err.response);
      if (err.response?.status === 401 || err.response.status === 404) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  });

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 100) return;

    try {
      await axios.put(
        `http://localhost:3333/cart/${cartItemId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      await fetchCartItems(); // Refresh cart data
      toast.success("Cart updated successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:3333/cart/${cartItemId}`, {
        withCredentials: true,
      });
      await fetchCartItems(); // Refresh cart data
      toast.success("Item removed from cart");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:3333/cart/clear-cart", {
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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
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
          <button className="btn btn-link" onClick={fetchCartItems}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid px-0"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <main className="container my-5 flex-grow-1">
        <h2 className="mb-4">Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <h4>Your cart is empty</h4>
            <Link to="/products" className="btn btn-primary mt-3">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Cart Items</h5>
                  <button
                    onClick={clearCart}
                    className="btn btn-sm btn-outline-danger"
                  >
                    Clear Cart
                  </button>
                </div>
                <div className="card-body">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="row mb-4 border-bottom pb-3 align-items-center"
                    >
                      <div className="col-md-2 col-4">
                        <img
                          src={
                            item.productId?.image ||
                            "https://via.placeholder.com/150"
                          }
                          alt={item.productId?.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: "100px" }}
                        />
                      </div>
                      <div className="col-md-5 col-8">
                        <h5 className="h6">{item.productId?.name}</h5>
                        <p className="text-muted small mb-1">
                          {item.productId?.brand}
                        </p>
                        <p className="mb-0">
                          ${item.productId?.price?.toFixed(2)}
                        </p>
                      </div>
                      <div className="col-md-3 col-6 mt-3 mt-md-0">
                        <div className="input-group">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="form-control text-center"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            disabled={item.quantity >= 100}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-md-2 col-6 text-end mt-3 mt-md-0">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeItem(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card sticky-top" style={{ top: "20px" }}>
                <div className="card-body">
                  <h5 className="card-title mb-4">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>
                      Subtotal (
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                      items)
                    </span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total</strong>
                    <strong>${calculateTotal()}</strong>
                  </div>
                  <Link
                    to="/checkout"
                    className="btn btn-primary w-100 mb-2"
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    to="/products"
                    className="btn btn-outline-secondary w-100"
                  >
                    Continue Shopping
                  </Link>
                </div>
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
