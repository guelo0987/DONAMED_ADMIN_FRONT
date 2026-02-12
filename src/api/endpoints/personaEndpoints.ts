/**
 * Endpoints del controlador de Personas/Usuarios
 * Base: /api/v1/admin
 */
export const PERSONA_ENDPOINTS = {
    usuarios: "/admin/usuarios",
    usuarioById: (id: number) => `/admin/usuarios/${id}`,
    personas: "/admin/personas",
    personaByCedula: (cedula: string) => `/admin/personas/${cedula}`,
} as const;
