import Navbar from "../components/Navbar";
import { Outlet } from 'react-router-dom';

function MainPage() {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
}

export default MainPage