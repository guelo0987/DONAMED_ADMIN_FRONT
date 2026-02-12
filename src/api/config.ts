/**
 * Configuración central de la API DONAMED
 * Base URL desde variables de entorno o fallback para desarrollo
 */
export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
    timeout: 30000,
} as const;
