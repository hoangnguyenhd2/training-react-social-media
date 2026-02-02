import { RouteGuard } from './RouteGuard';

export function ProtectedRoute() {
    return <RouteGuard requireAuth />;
}
