import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "./common/header";
import Footer from "./common/footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CSS/payment-success.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  const reference = searchParams.get("reference");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (reference && orderId) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [reference, orderId]);

  const verifyPayment = async () => {
    try {
      setVerifying(true);
      
      const response = await axios.post(
        `https://e-commerce-7-20zw.onrender.com/payment/verify-payment`,
        {
          reference,
          orderId
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setOrder(response.data.data);
        toast.success("Payment verified successfully!");
      } else {
        toast.error("Payment verification failed");
        navigate("/checkout");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
      console.error("Payment verification error:", err);
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  if (loading || verifying) {
    return (
      <div className="payment-success-container">
        <Header />
        <div className="payment-loading">
          <div className="payment-spinner"></div>
          <h2>{verifying ? "Verifying Payment..." : "Loading..."}</h2>
          <p>Please wait while we process your payment</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!reference || !orderId) {
    return (
      <div className="payment-success-container">
        <Header />
        <div className="payment-error">
          <div className="error-icon">⚠️</div>
          <h2>Invalid Payment Link</h2>
          <p>The payment link is invalid or incomplete.</p>
          <button 
            className="continue-btn"
            onClick={() => navigate("/checkout")}
          >
            Back to Checkout
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <Header />
      <main className="payment-success-main">
        <div className="success-content">
          <div className="success-icon">
            <div className="checkmark">
              <div className="checkmark-circle">
                <div className="checkmark-stem"></div>
                <div className="checkmark-kick"></div>
              </div>
            </div>
          </div>
          
          <h1>Payment Successful!</h1>
          <p className="success-message">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>

          {order && (
            <div className="order-details">
              <h2>Order Details</h2>
              <div className="order-info">
                <div className="info-row">
                  <span className="label">Order Number:</span>
                  <span className="value">{order.orderNumber}</span>
                </div>
                <div className="info-row">
                  <span className="label">Total Amount:</span>
                  <span className="value">${order.totalAmount}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className="value status-completed">Completed</span>
                </div>
                <div className="info-row">
                  <span className="label">Payment Method:</span>
                  <span className="value">Chapa Payment</span>
                </div>
              </div>
            </div>
          )}

          <div className="success-actions">
            <button 
              className="continue-shopping-btn"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
            <button 
              className="view-orders-btn"
              onClick={handleViewOrders}
            >
              View My Orders
            </button>
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>You will receive an email confirmation shortly</li>
              <li>Your order will be processed within 1-2 business days</li>
              <li>You will receive tracking information once your order ships</li>
              <li>If you have any questions, please contact our support team</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
