import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./admin_dashboard.css";

const AdminDashboard = () => {
  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <nav
        className="bg-dark text-white p-3 flex-shrink-0"
        style={{ width: "240px" }}
      >
        <h3 className="mb-4 text-center header">Admin Panel</h3>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin_dashboard">
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/manage_products">
              <i className="bi bi-box-seam me-2"></i>Products
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/order">
              <i className="bi bi-bag-check me-2"></i>Orders
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/manage_customers">
              <i className="bi bi-people me-2"></i>Manage Customers
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/customer">
              <i className="bi bi-person me-2"></i>As Customer
            </Link>
          </li>
          <li className="nav-item mt-4">
            <Link className="nav-link text-danger" to="/logout">
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light">
        <h1 className="mb-4 header ms-5">Welcome to Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className="row g-4 mb-4 ">
          <div className="col-md-3">
            <div className="card shadow-sm border-0 text-center">
              <div className="card-body">
                <h6 className="card-title text-muted">Total Products</h6>
                <h2 className="card-text fw-bold">120</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 text-center">
              <div className="card-body">
                <h6 className="card-title text-muted">Orders</h6>
                <h2 className="card-text fw-bold">87</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 text-center">
              <div className="card-body">
                <h6 className="card-title text-muted">Sales</h6>
                <h2 className="card-text fw-bold">$12,450</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 text-center">
              <div className="card-body">
                <h6 className="card-title text-muted">Customers</h6>
                <h2 className="card-text fw-bold">345</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Overview */}
        <div className="mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title mb-3">Sales Overview</h5>
              <div className="bg-secondary bg-opacity-10 rounded p-5 text-center text-muted">
                [Chart Placeholder]
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title mb-3">Recent Activities</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  🛒 Order #2345 placed by John Doe
                </li>
                <li className="list-group-item">
                  📦 New product "Smartphone X" added
                </li>
                <li className="list-group-item">
                  👤 New customer Jane Smith registered
                </li>
                <li className="list-group-item">
                  🔄 Order #2321 status updated to "Shipped"
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
