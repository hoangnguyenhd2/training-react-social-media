import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Loader } from '@/components/shared/Loader';

interface RouteGuardProps {
    requireAuth?: boolean;
    redirectTo?: string;
}

export function RouteGuard({ 
    requireAuth = true, 
    redirectTo 
}: RouteGuardProps) {
    const { isReady, isLogged } = useAuth();

    if (!isReady) {
        return <Loader />;
    }

    if (requireAuth && !isLogged) {
        return <Navigate to={redirectTo || ROUTES.LOGIN} replace />;
    }

    if (!requireAuth && isLogged) {
        return <Navigate to={redirectTo || ROUTES.INDEX} replace />;
    }

    return <Outlet />;
}
