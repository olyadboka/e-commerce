import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "../CSS/login.css";

const RegisterForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;

    if (
      formEl.checkValidity() === false ||
      form.password !== form.confirmPassword
    ) {
      e.stopPropagation();
      setError(
        form.password !== form.confirmPassword
          ? "Passwords don't match!"
          : "Please fill all required fields!"
      );
      setValidated(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "import.meta.VITE_BACKEND_URL3/signup",
        {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          addresses: [
            {
              street: form.street,
              city: form.city,
              state: form.state,
              country: form.country,
              zipCode: form.zipCode,
              isDefault: true,
            },
          ],
        }
      );

      console.log("Registration successful:", response.data);

      window.location.href = "/login";
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setValidated(true);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="text-primary fw-bold">Create Your Account</h2>
                <p className="text-muted">Join our community today</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name*</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your first name
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name*</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address*</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number*</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <h5 className="mt-4 mb-3 text-muted">Address Information</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Country*</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Street Address*</Form.Label>
                  <Form.Control
                    type="text"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City*</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>State*</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>ZIP Code*</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        value={form.zipCode}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mt-4 mb-3 text-muted">Security</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password*</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                      />
                      <Form.Text className="text-muted">
                        Minimum 8 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password*</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        isInvalid={
                          form.password !== form.confirmPassword &&
                          form.confirmPassword
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        Passwords must match
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4 form-check">
                  <Form.Check
                    type="checkbox"
                    id="termsCheck"
                    label={
                      <>
                        I agree to the <a href="/terms">Terms of Service</a> and{" "}
                        <a href="/privacy">Privacy Policy</a>
                      </>
                    }
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="text-center mt-3">
                  <p className="text-muted">
                    Already have an account? <a href="/login">Sign in</a>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
