/**
 * Endpoints del controlador de Proveedores
 * Base: /api/v1/admin
 */
export const PROVEEDOR_ENDPOINTS = {
    proveedores: "/admin/proveedores",
    proveedorById: (id: string) => `/admin/proveedores/${encodeURIComponent(id)}`,
    proveedorStats: (id: string) => `/admin/proveedores/${encodeURIComponent(id)}/stats`,
} as const;
