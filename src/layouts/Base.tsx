import { Outlet, ScrollRestoration } from "react-router-dom";
import { Navbar } from "@/components/shared/Navbar";

const Base = () => {
    return (
        <>
            <Navbar />
            <main className="min-h-screen layout py-6">
                <Outlet />
            </main>
            <ScrollRestoration />
        </>
    );
};

export default Base;
