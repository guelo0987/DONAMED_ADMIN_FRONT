/**
 * Endpoints del controlador de autenticación
 * Base: /api/v1/admin/auth
 */
export const AUTH_ENDPOINTS = {
    login: "/admin/auth/login",
    refresh: "/admin/auth/refresh",
    me: "/admin/auth/me",
} as const;
