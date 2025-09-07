import AdminDashboard from "../../pages/Admin/AdminDashboard";
import Revenue from "../../pages/Admin/Revenue";
import UserReports from "../../pages/Admin/UserReports";

export const adminRoutes = [
  {
    path: "dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "revenue",
    element: <Revenue />,
  },
  {
    path: "user-reports",
    element: <UserReports />,
  },
];
