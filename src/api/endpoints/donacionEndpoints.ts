/**
 * Endpoints de Donaciones
 * Base: /api/v1
 */
export const DONACION_ENDPOINTS = {
    donaciones: "/admin/donaciones",
    donacionById: (id: number) => `/admin/donaciones/${id}`,
    addMedicamentos: (id: number) => `/admin/donaciones/${id}/medicamentos`,
} as const;
