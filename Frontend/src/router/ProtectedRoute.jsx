import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";

const FullPageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Tránh gọi side-effect (toast) trong pha render
  const [redirectHome, setRedirectHome] = useState(false);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (
      !loading &&
      isAuthenticated &&
      allowedRoles &&
      !allowedRoles.includes(user?.role) &&
      !notifiedRef.current
    ) {
      notifiedRef.current = true;
      toast.error("Bạn không có quyền truy cập vào trang này.");
      setRedirectHome(true);
    }
  }, [loading, isAuthenticated, allowedRoles, user]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Không đủ quyền: đợi effect chạy rồi mới chuyển hướng, tránh cập nhật state khi render
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return redirectHome ? <Navigate to="/" replace /> : <FullPageLoader />;
  }

  return children;
};

export default ProtectedRoute;
