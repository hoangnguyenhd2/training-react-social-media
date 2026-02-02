import { RouteGuard } from './RouteGuard';

export function GuestRoute() {
    return <RouteGuard requireAuth={false} />;
}
