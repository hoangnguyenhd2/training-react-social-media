import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Loader } from '@/components/shared/Loader';

export function AdminRoute() {
    const { isReady, isLogged, user } = useAuth();

    if (!isReady) {
        return <Loader />;
    }

    if (!isLogged) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to={ROUTES.INDEX} replace />;
    }

    return <Outlet />;
}
