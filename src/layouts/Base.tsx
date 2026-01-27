import { Outlet, ScrollRestoration } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const LayoutBase = () => {
    return (
        <>
            <header className="sticky top-0 z-10">
                <Navbar />
            </header>
            <main className="min-h-screen layout dark md:py-[--layout-spacing] py-[calc(var(--layout-spacing)*0.5)]">
                <Outlet />
                <ScrollRestoration />
            </main>
        </>
    );
};

export default LayoutBase;