import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "./common/header";
import Footer from "./common/footer";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("http://localhost:3333/cart");
        setCartItems(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await axios.put(
        `http://localhost:3333/cart/${productId}`,
        { quantity: newQuantity }
      );

      setCartItems(
        cartItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:3333/cart/${productId}`, {});

      setCartItems(cartItems.filter((item) => item.productId !== productId));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  if (loading) return <div className="text-center py-5">Loading cart...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div
      className="container-fluid px-0"
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <div className="container my-5 flex-grow-1">
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
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="row mb-4 border-bottom pb-3"
                    >
                      <div className="col-md-3">
                        <img
                          src={item.image || "https://via.placeholder.com/150"}
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: "150px" }}
                        />
                      </div>
                      <div className="col-md-6">
                        <h5>{item.name}</h5>
                        <p className="text-muted">{item.brand}</p>
                        <p>${item.price.toFixed(2)}</p>
                      </div>
                      <div className="col-md-3">
                        <div className="d-flex align-items-center mb-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeItem(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
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
                  <Link to="/checkout" className="btn btn-primary w-100">
                    Proceed to Checkout
                  </Link>
                  <Link
                    to="/products"
                    className="btn btn-outline-secondary w-100 mt-2"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
