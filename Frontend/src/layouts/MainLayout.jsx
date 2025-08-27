import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 mt-[100px] min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
