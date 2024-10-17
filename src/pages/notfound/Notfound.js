import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.message}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" style={styles.link}>
        Go back to Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full viewport height
    textAlign: "center",
    backgroundColor: "#f7f7f7", // Soft background color
    padding: "2rem",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "10rem", // Larger, impactful font size
    fontWeight: "bold",
    margin: 0,
    color: "#2c3e50", // Darker shade for the title
  },
  message: {
    fontSize: "1.5rem",
    color: "#7f8c8d", // Softer color for the message
    marginBottom: "2rem",
  },
  link: {
    fontSize: "1.25rem",
    color: "#3498db", // Bright color for the link
    textDecoration: "none",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3498db", // Button-like background
    color: "white",
    borderRadius: "5px",
    transition: "background-color 0.3s ease", // Smooth hover effect
  },
  linkHover: {
    backgroundColor: "#2980b9",
  },
};

export default NotFound;
