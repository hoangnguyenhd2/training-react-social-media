import { createContext, useMemo, useEffect, useState, useCallback, useRef } from 'react';
import type { User } from '@/types/user';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextProps {
    isReady: boolean;
    isLogged: boolean;
    user: User | null;
    login: (payload: { email: string; password: string }) => Promise<User>;
    register: (payload: { email: string; password: string; name: string; username: string }) => Promise<User>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthService {
    me: () => Promise<User | null>;
    login: (payload: { email: string; password: string }) => Promise<User>;
    register: (payload: { email: string; password: string; name: string; username: string }) => Promise<User>;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: React.ReactNode;
    authService: AuthService;
}

export function AuthProvider({ children, authService }: AuthProviderProps) {
    const [isReady, setIsReady] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [_isFirebaseLogged, setIsFirebaseLogged] = useState(false); // New state to track Firebase Auth status
    const mountedRef = useRef(true);

    const isLogged = _isFirebaseLogged; // isLogged now directly reflects Firebase Auth status

    useEffect(() => {
        mountedRef.current = true;

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!mountedRef.current) return;

            try {
                if (firebaseUser) {
                    setIsFirebaseLogged(true); // User is logged in via Firebase Auth
                    const me = await authService.me();
                    if (mountedRef.current) {
                        setUser(me); // Hydrate user profile from Firestore
                    }
                } else {
                    setIsFirebaseLogged(false); // User is not logged in
                    if (mountedRef.current) {
                        setUser(null);
                        localStorage.removeItem('token');
                    }
                }
            } catch (error) {
                console.error("Auth state change error:", error);
                // Even if fetching profile fails, if firebaseUser exists, they are technically "logged in"
                // We'll set user to null but keep _isFirebaseLogged as true if firebaseUser existed.
                if (mountedRef.current) {
                    setUser(null);
                    localStorage.removeItem('token');
                    // If firebaseUser was there but profile fetch failed, still consider firebase logged
                    if (firebaseUser) setIsFirebaseLogged(true); 
                    else setIsFirebaseLogged(false);
                }
            } finally {
                if (mountedRef.current) setIsReady(true);
            }
        });

        return () => {
            mountedRef.current = false;
            unsubscribe();
        };
    }, [authService]);

    const login = useCallback(async (payload: { email: string; password: string }) => {
        const loggedUser = await authService.login(payload);
        setUser(loggedUser);
        setIsFirebaseLogged(true); // Ensure this is set to true on successful login
        return loggedUser;
    }, [authService]);

    const register = useCallback(async (payload: { email: string; password: string; name: string; username: string }) => {
        const newUser = await authService.register(payload);
        setUser(newUser);
        setIsFirebaseLogged(true); // Ensure this is set to true on successful register
        return newUser;
    }, [authService]);

    const logout = useCallback(async () => {
        await authService.logout();
        setUser(null);
        setIsFirebaseLogged(false); // Ensure this is set to false on logout
    }, [authService]);

    const value = useMemo(
        () => ({ isReady, isLogged, user, login, register, logout }),
        [isReady, isLogged, user, login, register, logout]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
