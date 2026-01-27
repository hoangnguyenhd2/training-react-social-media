export const ROUTES = {
    INDEX: '/',
    LOGIN: '/login'
} as const;

export type RouteKey = keyof typeof ROUTES;