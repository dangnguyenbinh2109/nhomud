import LoginPage from "../../pages/Auth/Login";
import ResetPassword from "../../pages/Auth/ResetPassword";
import Home from "../../pages/Home";

export const publicRoutes = [

    // Auth
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path: "/reset-password",
        element: <ResetPassword/>
    },

    {
        path: "/",
        element: <Home/>
    },
]