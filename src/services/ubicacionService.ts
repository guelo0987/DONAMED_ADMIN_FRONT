import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { UBICACION_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/auth.types";
import type { Provincia, Ciudad } from "@/types/persona.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

export interface ProvinciaConCiudades extends Provincia {
    ciudad?: Ciudad[];
}

/**
 * Servicio de ubicación (provincias, ciudades)
 */
export const ubicacionService = {
    async getProvincias(): Promise<ProvinciaConCiudades[]> {
        try {
            const { data } = await apiClient.get<ApiResponse<ProvinciaConCiudades[]>>(
                UBICACION_ENDPOINTS.provincias
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener provincias");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async getCiudades(codigoprovincia?: string): Promise<Ciudad[]> {
        try {
            const params = codigoprovincia ? { provinciaId: codigoprovincia } : {};
            const { data } = await apiClient.get<ApiResponse<Ciudad[]>>(
                UBICACION_ENDPOINTS.ciudades,
                { params }
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener ciudades");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async createProvincia(payload: { codigoprovincia: string; nombre: string }): Promise<Provincia> {
        try {
            const { data } = await apiClient.post<ApiResponse<Provincia>>(
                UBICACION_ENDPOINTS.provincias,
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al crear provincia");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async updateProvincia(codigoprovincia: string, payload: { nombre: string }): Promise<Provincia> {
        try {
            const { data } = await apiClient.put<ApiResponse<Provincia>>(
                UBICACION_ENDPOINTS.provinciaById(codigoprovincia),
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al actualizar provincia");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async deleteProvincia(codigoprovincia: string): Promise<void> {
        try {
            const { data } = await apiClient.delete<ApiResponse>(
                UBICACION_ENDPOINTS.provinciaById(codigoprovincia)
            );
            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al eliminar provincia");
            }
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async createCiudad(payload: { codigociudad: string; nombre: string; codigoprovincia: string }): Promise<Ciudad> {
        try {
            const { data } = await apiClient.post<ApiResponse<Ciudad>>(
                UBICACION_ENDPOINTS.ciudades,
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al crear ciudad");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async updateCiudad(codigociudad: string, payload: { nombre?: string; codigoprovincia?: string }): Promise<Ciudad> {
        try {
            const { data } = await apiClient.put<ApiResponse<Ciudad>>(
                UBICACION_ENDPOINTS.ciudadById(codigociudad),
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al actualizar ciudad");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async deleteCiudad(codigociudad: string): Promise<void> {
        try {
            const { data } = await apiClient.delete<ApiResponse>(
                UBICACION_ENDPOINTS.ciudadById(codigociudad)
            );
            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al eliminar ciudad");
            }
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
