import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { Envelope, Lock, Google, Facebook } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const navigate = useNavigate();

  // Validate form on change
  useEffect(() => {
    const isValid =
      !Object.values(errors).some((x) => x) &&
      formData.email &&
      formData.password;
    setFormValid(isValid);
  }, [errors, formData]);

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "email":
        if (!value) {
          errorMsg = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMsg = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          errorMsg = "Password is required";
        } else if (value.length < 6) {
          errorMsg = "Password must be at least 6 characters";
        }
        break;
      default:
        break;
    }

    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate only if the field has been touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formData[name]),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields on submit
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    if (Object.values(newErrors).some((x) => x)) {
      return;
    }

    setLoading(true);
    setError("");

    axios
      .post("http://localhost:3333/login", {
        email: formData.email,
        password: formData.password,
      })
      .then((res) => {
        console.log(res);
        if (res.status(201)) {
          window.location.href = "/home";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        className="shadow-lg border-0"
        style={{ width: "100%", maxWidth: "450px" }}
      >
        <Card.Body className="p-4 p-md-5">
          <div className="text-center mb-4">
            <img
              src="/logo.png"
              alt="Company Logo"
              style={{ height: "60px", marginBottom: "20px" }}
            />
            <h2 className="text-primary fw-bold">Welcome Back</h2>
            <p className="text-muted">Sign in to access your account</p>
          </div>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <Envelope />
                </span>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.email && !!errors.email}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <Lock />
                </span>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.password && !!errors.password}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-decoration-none"
                  onClick={() => navigate("/forgotpassword")}
                >
                  Forgot password?
                </Button>
              </div>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3 py-2 fw-bold"
              disabled={loading || !formValid}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="position-relative text-center my-4">
              <hr className="border-1" />
              <span
                className="position-absolute bg-white px-3"
                style={{ top: "-12px" }}
              >
                OR CONTINUE WITH
              </span>
            </div>

            <Row className="g-2 mb-4">
              <Col md={6}>
                <Button
                  variant="outline-danger"
                  className="w-100 d-flex align-items-center justify-content-center"
                  onClick={() => handleSocialLogin("Google")}
                >
                  <Google className="me-2" /> Google
                </Button>
              </Col>
              <Col md={6}>
                <Button
                  variant="outline-primary"
                  className="w-100 d-flex align-items-center justify-content-center"
                  onClick={() => handleSocialLogin("Facebook")}
                >
                  <Facebook className="me-2" /> Facebook
                </Button>
              </Col>
            </Row>

            <div className="text-center">
              <p className="text-muted">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 text-decoration-none"
                  onClick={() => navigate("/signup")}
                >
                  Sign up now
                </Button>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
