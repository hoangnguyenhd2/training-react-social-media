import { createContext, useMemo, useEffect, useState } from 'react';
import { type User } from '@/types/user';
import { useLoader } from '@/hooks/useLoader';
interface AuthContextProps {
    isLogged: boolean
    user: User | null
    login: (payload: any) => Promise<any>
    logout: () => void
};

export const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthService {
    me: () => Promise<User | null>
    login: (payload: any) => Promise<User>
    logout: () => Promise<void>
}

export const AuthProvider = ({ children, authService } : { children: React.ReactNode, authService: AuthService }) => {
    const { setLoading } = useLoader();
    const [ user, setUser ]   = useState<User | null>(null);
    const isLogged            = useMemo(() => !!user?.id, [user]);

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                const me = await authService.me();
                setUser(me);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    const login = async ( payload: any ) => {
        try {
            setLoading(true);
            const response = await authService.login(payload);
            setUser(response);
            return response;
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ isLogged, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}