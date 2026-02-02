import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { routes } from '@/routes';
/* global */
import '@/assets/css/style.css';
/* providers */
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LoaderProvider } from '@/contexts/LoaderContext';
/* components */
import { Toaster } from '@/components/ui/sonner';
import { Loader } from '@/components/shared/Loader';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query';
import { authService } from '@/services/auth.service';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <LoaderProvider>
                <AuthProvider authService={authService}>
                    <QueryClientProvider client={queryClient}>
                        <Suspense fallback={<Loader />}>
                            <RouterProvider router={routes} />
                        </Suspense>
                    </QueryClientProvider>
                </AuthProvider>
            </LoaderProvider>
            <Toaster />
        </ThemeProvider>
    </StrictMode>
);