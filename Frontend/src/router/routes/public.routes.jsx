import LoginPage from "../../pages/Auth/Login";
import Home from "../../pages/Home";

export const publicRoutes = [

    // Auth
    {
        path: "/login",
        element: <LoginPage/>
    },

    {
        path: "/",
        element: <Home/>
    },
]