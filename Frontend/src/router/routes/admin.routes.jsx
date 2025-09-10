import AdminDashboard from "../../pages/Admin/AdminDashboard";
import UserManagementPage from "../../pages/Admin/UserManagementPage";
import SystemConfigPage from "../../pages/Admin/SystemConfigPage";
import LessonPlanTemplateManagement from "../../pages/Admin/LessonPlanTemplateManagement";
import Revenue from "../../pages/Admin/Revenue";

export const adminRoutes = [
  {
    path: "dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "user-management",
    element: <UserManagementPage />,
  },
  {
    path: "system-settings",
    element: <SystemConfigPage />,
  },
  {
    path: "lesson-plan-templates",
    element: <LessonPlanTemplateManagement />,
  },
  {
    path: "revenue",
    element: <Revenue />,
  },
];