import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./adminCSS/manage_product.css";

const ManageProducts = () => {
  const [form, setForm] = useState({
    proName: "",
    proDescription: "",
    proCategory: "",
    proBrand: "",
    proPrice: "",
    proQuantity: "",
    proSku: "",
    proWeight: "",
    proDimensions: "",
  });

  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("add");

  useEffect(() => {
    // Fetch categories and brands
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes, productsRes] = await Promise.all([
          axios.get("http://localhost:3333/categories"),
          axios.get("http://localhost:3333/brands"),
          axios.get("http://localhost:3333/products"),
        ]);

        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages(files);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append product data
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
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
        resetForm();
        // Refresh products list
        const productsRes = await axios.get("http://localhost:3333/products");
        setProducts(productsRes.data);
        setActiveTab("view");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(
        `Failed to add product: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setForm({
      proName: "",
      proDescription: "",
      proCategory: "",
      proBrand: "",
      proPrice: "",
      proQuantity: "",
      proSku: "",
      proWeight: "",
      proDimensions: "",
    });
    setImages([]);
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3333/products/${id}`);
        setProducts(products.filter((product) => product._id !== id));
        alert("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <Header />
      <div className="d-flex min-vh-100">
        {/* Enhanced Sidebar */}
        <nav className="admin-sidebar bg-dark-blue text-white p-3 flex-shrink-0">
          <div className="sidebar-header mb-4 text-center">
            <h3 className="m-0 fw-bold">
              <i className="bi bi-shield-lock me-2"></i>Admin Panel
            </h3>
          </div>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link className="nav-link" to="/admin_dashboard">
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link active-link" to="/manage_products">
                <i className="bi bi-box-seam me-2"></i>Products
                <span className="badge bg-primary ms-auto">
                  {products.length}
                </span>
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link" to="/order">
                <i className="bi bi-bag-check me-2"></i>Orders
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link" to="/manage_customers">
                <i className="bi bi-people me-2"></i>Customers
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

        {/* Main Content */}
        <div className="admin-content flex-grow-1 p-4">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fw-bold text-dark-blue">
                <i className="bi bi-box-seam me-2"></i>Product Management
              </h1>
            </div>

            {/* Tab Navigation */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "add" ? "active" : ""}`}
                  onClick={() => setActiveTab("add")}
                >
                  Add Product
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "view" ? "active" : ""}`}
                  onClick={() => setActiveTab("view")}
                >
                  View Products
                </button>
              </li>
            </ul>

            {/* Add Product Form */}
            {activeTab === "add" && (
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <h2 className="card-title mb-4">
                    <i className="bi bi-plus-circle me-2"></i>Add New Product
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            name="proName"
                            className="form-control"
                            id="proName"
                            placeholder="Product Name"
                            value={form.proName}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="proName">Product Name*</label>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            name="proSku"
                            className="form-control"
                            id="proSku"
                            placeholder="SKU"
                            value={form.proSku}
                            onChange={handleChange}
                          />
                          <label htmlFor="proSku">SKU</label>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <select
                            name="proCategory"
                            className="form-select"
                            id="proCategory"
                            value={form.proCategory}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          <label htmlFor="proCategory">Category*</label>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <select
                            name="proBrand"
                            className="form-select"
                            id="proBrand"
                            value={form.proBrand}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Brand</option>
                            {brands.map((brand) => (
                              <option key={brand._id} value={brand._id}>
                                {brand.name}
                              </option>
                            ))}
                          </select>
                          <label htmlFor="proBrand">Brand*</label>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-floating mb-3">
                          <input
                            type="number"
                            name="proPrice"
                            className="form-control"
                            id="proPrice"
                            placeholder="Price"
                            value={form.proPrice}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                          />
                          <label htmlFor="proPrice">Price ($)*</label>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-floating mb-3">
                          <input
                            type="number"
                            name="proQuantity"
                            className="form-control"
                            id="proQuantity"
                            placeholder="Quantity"
                            value={form.proQuantity}
                            onChange={handleChange}
                            min="0"
                            required
                          />
                          <label htmlFor="proQuantity">Quantity*</label>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            name="proWeight"
                            className="form-control"
                            id="proWeight"
                            placeholder="Weight"
                            value={form.proWeight}
                            onChange={handleChange}
                          />
                          <label htmlFor="proWeight">Weight (kg)</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <textarea
                            name="proDescription"
                            className="form-control"
                            id="proDescription"
                            placeholder="Description"
                            value={form.proDescription}
                            onChange={handleChange}
                            style={{ height: "100px" }}
                          />
                          <label htmlFor="proDescription">Description</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="mb-3">
                          <label
                            htmlFor="images"
                            className="form-label fw-bold"
                          >
                            <i className="bi bi-images me-2"></i>Product Images
                            (Max 5)
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
                            Recommended size: 800x800px, Max file size: 2MB each
                          </div>
                        </div>

                        {images.length > 0 && (
                          <div className="mb-3">
                            <h6 className="fw-bold">Selected Images:</h6>
                            <div className="d-flex flex-wrap gap-3">
                              {images.map((image, index) => (
                                <div key={index} className="position-relative">
                                  <div className="border rounded p-2 bg-white">
                                    <img
                                      src={URL.createObjectURL(image)}
                                      alt={`Preview ${index + 1}`}
                                      className="img-thumbnail"
                                      style={{
                                        height: "100px",
                                        width: "100px",
                                        objectFit: "contain",
                                      }}
                                    />
                                    <div
                                      className="small text-center mt-1 text-truncate"
                                      style={{ maxWidth: "100px" }}
                                    >
                                      {image.name}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 translate-middle"
                                    onClick={() => removeImage(index)}
                                  >
                                    <i className="bi bi-x"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="col-12">
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="progress">
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated"
                                role="progressbar"
                                style={{ width: `${uploadProgress}%` }}
                                aria-valuenow={uploadProgress}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="col-12">
                        <div className="d-flex gap-2">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Adding...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-save me-2"></i>Add Product
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={resetForm}
                            disabled={isSubmitting}
                          >
                            <i className="bi bi-arrow-counterclockwise me-2"></i>
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* View Products Table */}
            {activeTab === "view" && (
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="card-title mb-0">
                      <i className="bi bi-list-ul me-2"></i>Product List
                    </h2>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setActiveTab("add")}
                      >
                        <i className="bi bi-plus-circle me-1"></i>Add New
                      </button>
                      <div
                        className="input-group input-group-sm"
                        style={{ width: "250px" }}
                      >
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search products..."
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                        >
                          <i className="bi bi-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th width="50px">#</th>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Brand</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th width="120px">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length > 0 ? (
                          products.map((product, index) => (
                            <tr key={product._id}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {product.images &&
                                    product.images.length > 0 && (
                                      <img
                                        src={`http://localhost:3333/uploads/${product.images[0]}`}
                                        alt={product.proName}
                                        className="rounded me-3"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    )}
                                  <div>
                                    <div className="fw-bold">
                                      {product.proName}
                                    </div>
                                    <small className="text-muted">
                                      {product.proSku || "N/A"}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                {categories.find(
                                  (c) => c._id === product.proCategory
                                )?.name || "N/A"}
                              </td>
                              <td>
                                {brands.find((b) => b._id === product.proBrand)
                                  ?.name || "N/A"}
                              </td>
                              <td className="fw-bold">${product.proPrice}</td>
                              <td>
                                <span
                                  className={`badge ${product.proQuantity > 0 ? "bg-success" : "bg-danger"}`}
                                >
                                  {product.proQuantity}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`badge ${product.proQuantity > 0 ? "bg-success" : "bg-danger"}`}
                                >
                                  {product.proQuantity > 0
                                    ? "In Stock"
                                    : "Out of Stock"}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button className="btn btn-sm btn-outline-primary">
                                    <i className="bi bi-pencil-square"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => deleteProduct(product._id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="8"
                              className="text-center py-4 text-muted"
                            >
                              <i className="bi bi-box-seam display-6 d-block mb-2"></i>
                              No products found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <nav aria-label="Page navigation" className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className="page-item disabled">
                        <a
                          className="page-link"
                          href="#"
                          tabIndex="-1"
                          aria-disabled="true"
                        >
                          Previous
                        </a>
                      </li>
                      <li className="page-item active">
                        <a className="page-link" href="#">
                          1
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          2
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          3
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageProducts;
