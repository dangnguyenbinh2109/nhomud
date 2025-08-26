import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, role, allowedRoles }) => {
    // const userRole = localStorage.getItem("role");

    const userRole = 'teacher';
    if (!userRole) 
        return <Navigate to="/login" />;

    if (!allowedRoles.includes(userRole))
        return <Navigate to="/" />;

    return element;
};

export default ProtectedRoute;
