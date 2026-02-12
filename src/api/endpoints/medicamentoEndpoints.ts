/**
 * Endpoints de Medicamentos
 * Base: /api/v1
 */
export const MEDICAMENTO_ENDPOINTS = {
    medicamentos: "/admin/medicamentos",
    medicamentoById: (codigo: string) => `/admin/medicamentos/${encodeURIComponent(codigo)}`,
} as const;
