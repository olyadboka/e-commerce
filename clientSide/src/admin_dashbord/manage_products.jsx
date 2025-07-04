import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./admin_dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./adminCSS/manage_product.css";
import axios from "axios";

const manage_products = () => {
  const [form, setForm] = useState({
    proName: "",
    proDescription: "",
    proCategory: "",
    proBrand: "",
    proPrice: "",
    proQuantity: "",
  });
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Append product data
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append all images
      images.forEach((image) => {
        formData.append("proImages", image);
      });

      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        "http://localhost:3333/add_product",
        formData,
        config
      );

      if (response.status === 200 || response.status === 201) {
        alert("Product added successfully!");
        setForm({
          proName: "",
          proCategory: "",
          proBrand: "",
          proPrice: "",
          proQuantity: "",
          proDescription: "",
        });
        setImages([]);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(
        `Failed to add product: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <>
      <div className="sidebar">
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
            <Link to="/customer">As Customer</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </div>

      <div className="main container flex">
        <h1>Welcome to Admin Dashboard</h1>
        <form
          onSubmit={handleSubmit}
          className="mt-4 p-4 bg-light rounded shadow-sm"
        >
          <h2 className="mb-4">Add Product</h2>

          <div className="mb-3">
            <input
              type="text"
              name="proName"
              className="form-control"
              placeholder="Product Name"
              value={form.proName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <textarea
              name="proDescription"
              className="form-control"
              placeholder="Product Description"
              value={form.proDescription}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="proCategory"
              className="form-control"
              placeholder="Product Category"
              value={form.proCategory}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="proBrand"
              className="form-control"
              placeholder="Product Brand"
              value={form.proBrand}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="number"
              name="proPrice"
              className="form-control"
              placeholder="Product Price"
              value={form.proPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="number"
              name="proQuantity"
              className="form-control"
              placeholder="Product Quantity"
              value={form.proQuantity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="images" className="form-label">
              Product Images (Multiple)
            </label>
            <input
              type="file"
              className="form-control"
              id="images"
              name="proImages"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              required
            />
            <div className="form-text">
              Select multiple images (JPEG, PNG, etc.)
            </div>
          </div>

          {images.length > 0 && (
            <div className="mb-3">
              <h6>Selected Images:</h6>
              <div className="d-flex flex-wrap gap-2">
                {Array.from(images).map((image, index) => (
                  <div key={index} className="border p-1">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      style={{ maxHeight: "100px", maxWidth: "100px" }}
                    />
                    <div
                      className="small text-truncate"
                      style={{ maxWidth: "100px" }}
                    >
                      {image.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-3">
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress}%
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-success w-30">
            Add Product
          </button>
        </form>
      </div>
    </>
  );
};

export default manage_products;
