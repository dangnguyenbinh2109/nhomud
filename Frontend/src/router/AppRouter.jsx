import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { publicRoutes } from "./routes/public.routes";
import { teacherRoutes } from "./routes/teacher.routes";
import { staffRoutes } from "./routes/staff.routes";
import { managerRoutes } from "./routes/manager.routes";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import TeacherDashboard from "../pages/Dashboard/TeacherDashboard";

const AppRouter = () => {
  // Teacher's canonical dashboard is "/dashboard"
  const teacherChildRoutes = teacherRoutes.filter(r => r.path !== 'dashboard');

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* Canonical teacher dashboard at /dashboard (uses TeacherLayout) */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherLayout /></ProtectedRoute>}
      >
        <Route index element={<TeacherDashboard />} />
      </Route>

      <Route
        path="/staff"
        element={<ProtectedRoute allowedRoles={['staff']}><DashboardLayout /></ProtectedRoute>}
      >
        {staffRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route
        path="/manager"
        element={<ProtectedRoute allowedRoles={['manager']}><DashboardLayout /></ProtectedRoute>}
      >
        {managerRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route
        path="/teacher"
        element={<ProtectedRoute allowedRoles={['teacher']}><TeacherLayout /></ProtectedRoute>}
      >
        {/* Redirect legacy /teacher/dashboard to canonical /dashboard */}
        <Route path="dashboard" element={<Navigate to="/dashboard" replace />} />
        {teacherChildRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {/* Redirect /teacher to /dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
