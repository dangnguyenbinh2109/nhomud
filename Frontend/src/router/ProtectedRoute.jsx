import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem("role") : null;

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }
  return element;
};

export default ProtectedRoute;
