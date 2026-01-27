import { createContext, useMemo, useEffect, useState } from 'react';
import { type User } from '@/types/user';
import { type LoginResponse } from '@/types/api';
import { useApi } from '@/hooks/useApi';

interface LoginPayload {
    username: string
    password: string
};

interface AuthContextProps {
    isLogged: boolean
    token: string
    user: User | null
    login: <T>(payload: LoginPayload) => Promise<T>
    refresh: () => void
    logout: () => void
};

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
    const api                 = useApi();
    const [ token, setToken ] = useState<string | null>(localStorage.getItem('token'));
    const [ user, setUser ]   = useState<User | null>(null);
    const isLogged            = useMemo(() => (!!token && !!user?.id), [user]);

    useEffect(() => {
        if (token && !user) {
            refresh();
        }
    }, [token]);

    const login = async <T extends LoginResponse>( payload: LoginPayload ) : Promise<T> => {
        await new Promise (resolve => setTimeout(resolve, 1000));
        const response = await api.post<T>('/mocks/user.json', payload);
        if (!(response?.username === payload.username && response?.password === payload.password)) {
            return {
                message: 'Invaild username or password'
            } as unknown as T;
        }
        if (response?.access_token) {
            setToken(response.access_token);
            localStorage.setItem('token', response.access_token);
        }
        return response;
    }

    const refresh = async () => {
        const user = await api.get('/mocks/user.json') as unknown as User;
        if (user?.id) {
            setUser(user as User);
        }
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider value={{ isLogged, token, user, login, refresh, logout }}>
            {children}
        </AuthContext.Provider>
    )
}