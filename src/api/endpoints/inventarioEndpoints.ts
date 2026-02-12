/**
 * Endpoints de Inventario
 * Base: /api/v1
 * GET /admin/inventario?almacen=&medicamento=
 */
export const INVENTARIO_ENDPOINTS = {
    inventario: "/admin/inventario",
    stockConsolidado: "/admin/inventory/stock",
} as const;
