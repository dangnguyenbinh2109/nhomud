import { useRoutes, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { publicRoutes } from "./routes/public.routes";
import { teacherRoutes } from "./routes/teacher.routes";
import { adminRoutes } from "./routes/admin.routes";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

const AppRouter = () => {
  const role = localStorage.getItem("role");

  const routes = [
    {
      path: "/",
      element:
        role === "admin" ? <Navigate to="/admin/dashboard" replace /> : <MainLayout />,
      children: [
        ...publicRoutes,
        ...teacherRoutes.map((r) => ({
          ...r,
          element: (
            <ProtectedRoute element={r.element} allowedRoles={["teacher"]} />
          ),
        })),
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute
          element={<AdminLayout />} // Layout riêng cho admin
          allowedRoles={["admin"]}
        />
      ),
      children: adminRoutes,
    },
    { path: "*", element: <Navigate to="/" replace /> }, // fallback cho route không tồn tại
  ];

  return useRoutes(routes);
};

export default AppRouter;
