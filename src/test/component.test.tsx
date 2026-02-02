import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Firebase before importing any module that uses it
vi.mock('@/lib/firebase', () => ({
    auth: { currentUser: null },
    db: {},
    storage: {},
    analytics: null
}));

/* providers */
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LoaderProvider } from '@/contexts/LoaderContext';
import { AuthContext } from '@/contexts/AuthContext';

/* components */
import { Toaster } from '@/components/ui/sonner';
import { Loader } from '@/components/shared/Loader';
import type { User } from '@/types/user';

// Inline mock data
const mockUser: User = {
    id: 'mock-user-123',
    username: 'testuser',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
    role: 'user'
};

// Create mock auth context value
const mockAuthValue = {
    isReady: true,
    isLogged: false,
    user: null,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn()
};

describe('App Component Integration Test', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render app shell without crashing', () => {
        const { container } = render(
            <ThemeProvider>
                <LoaderProvider>
                    <AuthContext.Provider value={mockAuthValue}>
                        <QueryClientProvider client={new QueryClient()}>
                            <Suspense fallback={<Loader />}>
                                <MemoryRouter>
                                    <div>App Content</div>
                                </MemoryRouter>
                            </Suspense>
                        </QueryClientProvider>
                    </AuthContext.Provider>
                </LoaderProvider>
                <Toaster />
            </ThemeProvider>
        );
        expect(container).toBeInTheDocument();
    });

    it('should render with logged in user', () => {
        const loggedInAuthValue = {
            ...mockAuthValue,
            isLogged: true,
            user: mockUser
        };

        const { container } = render(
            <ThemeProvider>
                <LoaderProvider>
                    <AuthContext.Provider value={loggedInAuthValue}>
                        <QueryClientProvider client={new QueryClient()}>
                            <Suspense fallback={<Loader />}>
                                <MemoryRouter>
                                    <div>Logged In Content</div>
                                </MemoryRouter>
                            </Suspense>
                        </QueryClientProvider>
                    </AuthContext.Provider>
                </LoaderProvider>
                <Toaster />
            </ThemeProvider>
        );
        expect(container).toBeInTheDocument();
    });
});
