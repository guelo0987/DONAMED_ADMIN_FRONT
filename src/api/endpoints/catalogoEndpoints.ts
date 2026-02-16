/**
 * Endpoints del controlador de Catálogos
 * Base: /api/v1
 */
export const CATALOGO_ENDPOINTS = {
    roles: "/admin/roles",
    categorias: "/admin/categorias",
    categoriaById: (id: number) => `/admin/categorias/${id}`,
    enfermedades: "/admin/enfermedades",
    enfermedadById: (id: number) => `/admin/enfermedades/${id}`,
    viasAdministracion: "/admin/vias-administracion",
    formasFarmaceuticas: "/admin/formas-farmaceuticas",
} as const;
