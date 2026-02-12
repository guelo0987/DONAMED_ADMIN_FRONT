/**
 * Endpoints del controlador de Catálogos
 * Base: /api/v1
 */
export const CATALOGO_ENDPOINTS = {
    roles: "/admin/roles",
    categorias: "/admin/categorias",
    enfermedades: "/admin/enfermedades",
    viasAdministracion: "/admin/vias-administracion",
    formasFarmaceuticas: "/admin/formas-farmaceuticas",
} as const;
