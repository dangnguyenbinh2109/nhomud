import ManagerDashboard from "../../layouts/ManagerDashboard";
import PackageManager from "../../layouts/PackageManager";
import OrderManagement from "../../layouts/OrderManagement";
import ContentApproval from "../../layouts/ContentApproval";

export const managerRoutes = [
  {
    path: "dashboard",
    element: <ManagerDashboard />,
  },
  {
    path: "packages",
    element: <PackageManager />,
  },
  {
    path: "orders",
    element: <OrderManagement />,
  },
  {
    path: "content-approval",
    element: <ContentApproval />,
  },
];