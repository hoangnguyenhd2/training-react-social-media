import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { routes } from '@/routes';
/* providers */
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LoaderProvider } from '@/contexts/LoaderContext';
/* components */
import { Toaster } from '@/components/ui/sonner';
import { Loader } from '@/components/Loader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { Suspense } from 'react';

describe('Test component', () => {
    it('should render component', async () => {
        const { container } = render(
            <ThemeProvider>
                <LoaderProvider>
                    <AuthProvider authService={authService}>
                        <QueryClientProvider client={new QueryClient()}>
                            <Suspense fallback={<Loader />}>
                                <RouterProvider router={routes} />
                            </Suspense>
                        </QueryClientProvider>
                    </AuthProvider>
                </LoaderProvider>
                <Toaster />
            </ThemeProvider>
        );
        expect(container).toBeInTheDocument();
    });
});