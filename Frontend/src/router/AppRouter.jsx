import { useRoutes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { publicRoutes } from "./routes/public.routes";
import { teacherRoutes } from "./routes/teacher.routes";
import MainLayout from "../layouts/MainLayout";

const AppRouter = () => {
    const routes = [
        {
        path: "/",
        element: <MainLayout />,
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
    ];

    return useRoutes(routes);
};

export default AppRouter;
