/**
 * Endpoints de Ubicación (Provincias, Ciudades)
 * Base: /api/v1
 */
export const UBICACION_ENDPOINTS = {
    provincias: "/admin/provincias",
    provinciaById: (id: string) => `/admin/provincias/${id}`,
    ciudades: "/admin/ciudades",
    ciudadById: (id: string) => `/admin/ciudades/${id}`,
} as const;
