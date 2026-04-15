import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout() {
    return (
        <div>
            <AnnouncementBar />
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Layout;