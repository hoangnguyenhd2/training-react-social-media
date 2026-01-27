import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { UserAvatar } from '@/components/User';
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Search, Moon, SunMoon } from "lucide-react";
import { Input } from '@/components/ui/input';
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem, 
} from '@/components/ui/dropdown-menu';

export function Navbar () {
    const { theme, toggleTheme }     = useTheme();
    const { isLogged, user, logout } = useAuth();

    return (
        <nav className="flex md:items-center md:flex-row flex-col bg-white dark:bg-black dark:border-muted border-b border-transparent shadow-sm">
            <div className="layout flex items-center justify-between min-h-[55px] w-full">
                <div className="flex items-center gap-x-4 w-full">
                    <Link to={ROUTES.INDEX} className="font-bold hover:underline text-xl block">
                        Social Media
                    </Link>
                    <Button className="block md:hidden" variant="outline">
                        <Search />
                    </Button>
                    <Input 
                        className="max-w-50 border-muted-700 ring-0 shadow-none h-9 hidden md:block" 
                        placeholder="Search..." 
                    />
                </div>
                <div className="flex items-center gap-x-2">
                    <Button 
                        variant="ghost"
                        onClick={toggleTheme}
                    >
                        {theme === 'light' ? <Moon /> : <SunMoon />}
                    </Button>
                    {isLogged ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="sm:min-w-38 w-fit gap-x-2">
                                    <UserAvatar size="sm" user={user} />
                                    <span className="hidden sm:block">{user?.name}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                                sideOffset={10}
                                align="end"
                            >
                                <DropdownMenuItem 
                                    className="text-red-500!"
                                    onClick={() => {
                                        if (confirm('Logout ?')) {
                                            logout();
                                        }
                                    }}
                                >Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button 
                            variant="dark"
                            asChild
                        >
                            <Link to={ROUTES.LOGIN}>Sign in</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    )
}