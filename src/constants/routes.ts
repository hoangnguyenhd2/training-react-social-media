export const ROUTES = {
    INDEX: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    POST_ANALYTICS: '/post/:id/analytics',
    POST_DETAIL: '/post/:id',
    // Admin
    ADMIN: '/admin',
    ADMIN_USERS: '/admin/users',
    ADMIN_POSTS: '/admin/posts'
} as const;

export type RouteKey = keyof typeof ROUTES;
