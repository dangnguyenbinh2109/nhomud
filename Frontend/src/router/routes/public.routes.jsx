import LoginPage from "../../pages/Auth/Login";
import Home from "../../pages/Home";
import About from "../../pages/About";
import Lession from "../../pages/Lession";
import Contact from "../../pages/Contact";
import ExamView from "../../pages/Teacher/ExamView";

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
    {
        path: "/about",
        element: <About/>
    },
    {
        path: "/lession",
        element: <Lession/>
    },
    {
        path: "/contact",
        element: <Contact/>
    },

    // Public view for an exam
    {
        path: "/exam/view/:examId",
        element: <ExamView />
    }
]
