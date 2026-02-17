/**
 * Endpoints de Solicitudes
 * Base: /api/v1
 */
export const SOLICITUD_ENDPOINTS = {
    solicitudes: "/admin/solicitudes",
    solicitudById: (id: number) => `/admin/solicitudes/${id}`,
    solicitudEstado: (id: number) => `/admin/solicitudes/${id}/estado`,
    solicitudDetalles: (id: number) => `/admin/solicitudes/${id}/detalles`,
} as const;
