import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { UserAvatar } from '@/components/users/User';
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Shield, LogOut } from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

export function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { isLogged, user, logout } = useAuth();

    return (
        <nav className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
            <div className="layout flex items-center justify-between h-14 px-4">
                <Link to={ROUTES.INDEX} className="font-bold text-lg">
                    Social<span className="text-blue-500">App</span>
                </Link>
                <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {theme === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
                    </Button>
                    {isLogged && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-2 px-2">
                                    <UserAvatar className="size-7" user={user} />
                                    <span className="hidden sm:block max-w-24 truncate">{user.name}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <div className="px-2 py-1.5">
                                    <p className="font-medium text-sm">{user.name}</p>
                                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                                </div>
                                <DropdownMenuSeparator />
                                {user.role === 'admin' && (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link to={ROUTES.ADMIN}>
                                                <Shield className="size-4 mr-2" />
                                                Admin Panel
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                <DropdownMenuItem 
                                    className="text-red-500 focus:text-red-500"
                                    onClick={() => logout()}
                                >
                                    <LogOut className="size-4 mr-2" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild size="sm">
                            <Link to={ROUTES.LOGIN}>Sign In</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
