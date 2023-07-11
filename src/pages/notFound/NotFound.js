import React from "react";

function NotFound() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#508bfc" }}
    >
      <div className="text-center">
        <h1 className="display-2 text-white">404</h1>
        <p className="lead text-white" style={{ fontSize: "1.5rem" }}>
          Page Not Found
        </p>
      </div>
    </div>
  );
}

export default NotFound;
