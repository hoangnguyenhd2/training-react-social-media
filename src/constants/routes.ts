export const ROUTES = {
    INDEX: '/',
    LOGIN: '/login',
    POST_ANALYTICS: '/post/:id/analytics'
} as const;

export type RouteKey = keyof typeof ROUTES;