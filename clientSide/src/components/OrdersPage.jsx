import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./common/header";
import Footer from "./common/footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CSS/orders.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://e-commerce-7-20zw.onrender.com/payment/orders`,
        { withCredentials: true }
      );
      setOrders(response.data.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: "/orders" } });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#27ae60";
      case "processing":
        return "#f39c12";
      case "shipped":
        return "#3498db";
      case "delivered":
        return "#27ae60";
      case "cancelled":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✅";
      case "processing":
        return "⏳";
      case "shipped":
        return "🚚";
      case "delivered":
        return "📦";
      case "cancelled":
        return "❌";
      default:
        return "⏸️";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="orders-container">
        <Header />
        <div className="orders-loading">
          <div className="orders-spinner"></div>
          <p>Loading your orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="orders-container">
      <Header />
      <main className="orders-main">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <button 
              className="start-shopping-btn"
              onClick={() => navigate("/products")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-content">
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order.orderNumber}</h3>
                      <p className="order-date">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="order-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                      >
                        {getStatusIcon(order.orderStatus)} {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="order-items-preview">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="order-item-preview">
                        <img
                          src={item.image || "https://via.placeholder.com/50"}
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/50";
                          }}
                        />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p>Qty: {item.quantity} × ${item.price}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="more-items">+{order.items.length - 3} more items</p>
                    )}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total: ${order.totalAmount}</span>
                    </div>
                    <button 
                      className="view-details-btn"
                      onClick={() => viewOrderDetails(order)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - #{selectedOrder.orderNumber}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="order-details-section">
                <h3>Order Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="label">Order Number:</span>
                    <span className="value">{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Order Date:</span>
                    <span className="value">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span 
                      className="value status"
                      style={{ color: getStatusColor(selectedOrder.orderStatus) }}
                    >
                      {getStatusIcon(selectedOrder.orderStatus)} {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Payment Status:</span>
                    <span 
                      className="value status"
                      style={{ color: getStatusColor(selectedOrder.paymentInfo.status) }}
                    >
                      {getStatusIcon(selectedOrder.paymentInfo.status)} {selectedOrder.paymentInfo.status.charAt(0).toUpperCase() + selectedOrder.paymentInfo.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-details-section">
                <h3>Shipping Address</h3>
                <div className="shipping-address">
                  <p><strong>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</strong></p>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                  <p>📧 {selectedOrder.shippingAddress.email}</p>
                  <p>📞 {selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              <div className="order-details-section">
                <h3>Order Items</h3>
                <div className="order-items">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img
                        src={item.image || "https://via.placeholder.com/80"}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80";
                        }}
                      />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.price}</p>
                        <p className="item-total">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-details-section">
                <h3>Order Summary</h3>
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.totalAmount}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrdersPage;
