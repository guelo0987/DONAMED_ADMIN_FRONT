/**
 * Endpoints de Lotes
 * Base: /api/v1
 */
export const LOTE_ENDPOINTS = {
    lotes: "/admin/lotes",
    loteById: (id: string) => `/admin/lotes/${id}`,
} as const;
