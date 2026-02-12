/**
 * Endpoints de Almacenes
 * Base: /api/v1
 */
export const ALMACEN_ENDPOINTS = {
    almacenes: "/admin/almacenes",
    almacenById: (id: number) => `/admin/almacenes/${id}`,
} as const;
