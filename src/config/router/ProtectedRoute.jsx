import { Navigate } from "react-router-dom/dist";

const ProtectedRoute = ({ role, path, element }) => {
  const userRole = localStorage.getItem("role"); // Get role from local storage

  if (role === userRole) {
    return element;
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
