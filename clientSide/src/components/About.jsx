import React from "react";
import Header from "./common/header";
import Footer from "./common/footer";

const About = () => {
  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9f9f9",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            maxWidth: "700px",
            width: "100%",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#2d3748", marginBottom: "16px" }}>About Us</h1>
          <p
            style={{ color: "#4a5568", fontSize: "1.1rem", lineHeight: "1.7" }}
          >
            Welcome to our e-commerce platform! <br />
            <br />
            We are dedicated to providing you with the best online shopping
            experience, offering a wide range of quality products at competitive
            prices. <br />
            <br />
            Our team is passionate about customer satisfaction and strives to
            deliver excellence in every aspect of our service.
          </p>
          <hr
            style={{
              margin: "32px 0",
              border: "none",
              borderTop: "1px solid #e2e8f0",
            }}
          />
          <h2 style={{ color: "#2b6cb0", marginBottom: "12px" }}>
            Our Mission
          </h2>
          <p
            style={{ color: "#4a5568", fontSize: "1rem", marginBottom: "24px" }}
          >
            To empower customers by making online shopping simple, enjoyable,
            and accessible to everyone. We believe in quality, transparency, and
            building lasting relationships with our customers.
          </p>
          <h2 style={{ color: "#2b6cb0", marginBottom: "12px" }}>
            Why Choose Us?
          </h2>
          <ul
            style={{
              color: "#4a5568",
              fontSize: "1rem",
              textAlign: "left",
              maxWidth: "500px",
              margin: "0 auto 24px auto",
              paddingLeft: "20px",
            }}
          >
            <li>✔️ Wide selection of top-quality products</li>
            <li>✔️ Fast and reliable shipping</li>
            <li>✔️ Secure payment options</li>
            <li>✔️ Friendly and responsive customer support</li>
            <li>✔️ Easy returns and hassle-free refunds</li>
          </ul>
          <h2 style={{ color: "#2b6cb0", marginBottom: "12px" }}>Contact Us</h2>
          <p style={{ color: "#4a5568", fontSize: "1rem" }}>
            Have questions or feedback? Reach out to us at{" "}
            <a
              href="mailto:support@ecommerce.com"
              style={{ color: "#3182ce", textDecoration: "underline" }}
            >
              support@ecommerce.com
            </a>
            .<br />
            We're here to help!
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;
