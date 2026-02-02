import { NavLink, Outlet } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { LayoutDashboard, Users, FileText, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { to: ROUTES.ADMIN, icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: ROUTES.ADMIN_USERS, icon: Users, label: 'Users' },
    { to: ROUTES.ADMIN_POSTS, icon: FileText, label: 'Posts' }
];

export default function AdminLayout() {
    return (
        <div className="flex min-h-[calc(100vh-3.5rem)]">
            <aside className="w-56 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex-shrink-0">
                <div className="p-4 sticky top-14">
                    <NavLink 
                        to={ROUTES.INDEX}
                        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6"
                    >
                        <ArrowLeft className="size-4" />
                        Back to App
                    </NavLink>

                    <nav className="space-y-1">
                        {NAV_ITEMS.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive 
                                        ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" 
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                                )}
                            >
                                <item.icon className="size-5" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </aside>

            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}
