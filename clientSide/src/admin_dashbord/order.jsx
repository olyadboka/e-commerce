import React from "react";
import { Link } from "react-router-dom";
import "./admin_dashboard.css";

const admin_dashboard = () => {
  return (
    <>
      <div className="sidebar">
        {/* The side bar contains the Add products page, orders, sales, customers, top selling products */}
        <ul>
          <li>
            <Link to="/admin_dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/order">Orders</Link>
          </li>
          <li>
            <Link to="/manage_customers">Manage Customers</Link>
          </li>
          <li>
            <Link to="/customer">as customer</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </div>

      <div className="main">
        {/* Add your dashboard content or nested routes here */}
        <h1>Welcome to Admin Dashboard</h1>
      </div>
    </>
  );
};

export default admin_dashboard;
