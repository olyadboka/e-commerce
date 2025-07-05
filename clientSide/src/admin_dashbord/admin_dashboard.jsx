import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "../components/common/header";
import Footer from "../components/common/footer";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Header />
      <div className="d-flex min-vh-100">
        {/* Sidebar - Enhanced with better styling */}
        <nav className="admin-sidebar bg-dark-blue text-white p-3 flex-shrink-0">
          <div className="sidebar-header mb-4 text-center">
            <h3 className="m-0 fw-bold">
              <i className="bi bi-shield-lock me-2"></i>Admin Panel
            </h3>
          </div>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link className="nav-link active-link" to="/admin_dashboard">
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
                <i className="bi bi-chevron-right ms-auto"></i>
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link" to="/manage_products">
                <i className="bi bi-box-seam me-2"></i>Products
                <span className="badge bg-primary ms-auto">120</span>
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link" to="/order">
                <i className="bi bi-bag-check me-2"></i>Orders
                <span className="badge bg-warning text-dark ms-auto">87</span>
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link" to="/manage_customers">
                <i className="bi bi-people me-2"></i>Customers
                <span className="badge bg-success ms-auto">345</span>
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link" to="/customer">
                <i className="bi bi-person me-2"></i>As Customer
              </Link>
            </li>
            <li className="nav-item mt-4 pt-3 border-top">
              <Link className="nav-link text-danger" to="/logout">
                <i className="bi bi-box-arrow-right me-2"></i>Logout
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content - Enhanced layout */}
        <div className="admin-content flex-grow-1 p-4">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fw-bold text-dark-blue">
                <i className="bi bi-speedometer2 me-2"></i>Dashboard Overview
              </h1>
              <div className="date-selector">
                <select className="form-select form-select-sm">
                  <option>Today</option>
                  <option>This Week</option>
                  <option selected>This Month</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>

            {/* Summary Cards - Enhanced with icons and animations */}
            <div className="row g-4 mb-4">
              <div className="col-xl-3 col-md-6">
                <div className="card summary-card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title text-muted mb-2">
                          Total Products
                        </h6>
                        <h2 className="card-text fw-bold mb-0">120</h2>
                        <small className="text-success">
                          <i className="bi bi-arrow-up"></i> 12% from last month
                        </small>
                      </div>
                      <div className="icon-circle bg-primary-light">
                        <i className="bi bi-box-seam text-primary"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="card summary-card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title text-muted mb-2">
                          Total Orders
                        </h6>
                        <h2 className="card-text fw-bold mb-0">87</h2>
                        <small className="text-success">
                          <i className="bi bi-arrow-up"></i> 8% from last month
                        </small>
                      </div>
                      <div className="icon-circle bg-warning-light">
                        <i className="bi bi-bag-check text-warning"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="card summary-card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title text-muted mb-2">
                          Total Sales
                        </h6>
                        <h2 className="card-text fw-bold mb-0">$12,450</h2>
                        <small className="text-success">
                          <i className="bi bi-arrow-up"></i> 24% from last month
                        </small>
                      </div>
                      <div className="icon-circle bg-success-light">
                        <i className="bi bi-currency-dollar text-success"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="card summary-card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title text-muted mb-2">
                          Customers
                        </h6>
                        <h2 className="card-text fw-bold mb-0">345</h2>
                        <small className="text-danger">
                          <i className="bi bi-arrow-down"></i> 3% from last
                          month
                        </small>
                      </div>
                      <div className="icon-circle bg-info-light">
                        <i className="bi bi-people text-info"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="row g-4 mb-4">
              {/* Sales Chart */}
              <div className="col-xl-8">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0">Sales Overview</h5>
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-outline-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                        >
                          This Year
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              This Week
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              This Month
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              This Year
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="chart-container">
                      <div className="d-flex justify-content-center align-items-center bg-light rounded p-5 text-center text-muted h-100">
                        <div>
                          <i className="bi bi-bar-chart-line display-4 mb-3"></i>
                          <p>Sales chart will be displayed here</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="col-xl-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Revenue Breakdown</h5>
                    <div className="d-flex justify-content-center align-items-center bg-light rounded p-5 text-center text-muted h-100">
                      <div>
                        <i className="bi bi-pie-chart display-4 mb-3"></i>
                        <p>Revenue pie chart will be displayed here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities and Top Products */}
            <div className="row g-4">
              {/* Recent Activities */}
              <div className="col-xl-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0">Recent Activities</h5>
                      <button className="btn btn-sm btn-outline-primary">
                        View All
                      </button>
                    </div>
                    <div className="activity-feed">
                      <div className="activity-item d-flex pb-3 mb-3 border-bottom">
                        <div className="activity-icon bg-primary-light text-primary rounded-circle flex-shrink-0">
                          <i className="bi bi-cart"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="mb-0 fw-bold">New Order #2345</h6>
                          <p className="mb-0 text-muted small">
                            John Doe placed a new order for $245.00
                          </p>
                          <small className="text-muted">2 minutes ago</small>
                        </div>
                      </div>
                      <div className="activity-item d-flex pb-3 mb-3 border-bottom">
                        <div className="activity-icon bg-success-light text-success rounded-circle flex-shrink-0">
                          <i className="bi bi-box-seam"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="mb-0 fw-bold">New Product Added</h6>
                          <p className="mb-0 text-muted small">
                            "Smartphone X" was added to inventory
                          </p>
                          <small className="text-muted">1 hour ago</small>
                        </div>
                      </div>
                      <div className="activity-item d-flex pb-3 mb-3 border-bottom">
                        <div className="activity-icon bg-info-light text-info rounded-circle flex-shrink-0">
                          <i className="bi bi-person"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="mb-0 fw-bold">New Customer</h6>
                          <p className="mb-0 text-muted small">
                            Jane Smith registered a new account
                          </p>
                          <small className="text-muted">3 hours ago</small>
                        </div>
                      </div>
                      <div className="activity-item d-flex">
                        <div className="activity-icon bg-warning-light text-warning rounded-circle flex-shrink-0">
                          <i className="bi bi-truck"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="mb-0 fw-bold">Order Shipped</h6>
                          <p className="mb-0 text-muted small">
                            Order #2321 status updated to "Shipped"
                          </p>
                          <small className="text-muted">Yesterday</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="col-xl-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0">Top Selling Products</h5>
                      <button className="btn btn-sm btn-outline-primary">
                        View All
                      </button>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Sold</th>
                            <th>Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src="https://via.placeholder.com/40"
                                  className="rounded me-2"
                                  alt="product"
                                />
                                <span>Wireless Headphones</span>
                              </div>
                            </td>
                            <td>$99.99</td>
                            <td>142</td>
                            <td className="fw-bold">$14,198</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src="https://via.placeholder.com/40"
                                  className="rounded me-2"
                                  alt="product"
                                />
                                <span>Smart Watch</span>
                              </div>
                            </td>
                            <td>$199.99</td>
                            <td>87</td>
                            <td className="fw-bold">$17,399</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src="https://via.placeholder.com/40"
                                  className="rounded me-2"
                                  alt="product"
                                />
                                <span>Bluetooth Speaker</span>
                              </div>
                            </td>
                            <td>$59.99</td>
                            <td>203</td>
                            <td className="fw-bold">$12,178</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src="https://via.placeholder.com/40"
                                  className="rounded me-2"
                                  alt="product"
                                />
                                <span>Power Bank</span>
                              </div>
                            </td>
                            <td>$29.99</td>
                            <td>156</td>
                            <td className="fw-bold">$4,678</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
