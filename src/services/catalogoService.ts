import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { CATALOGO_ENDPOINTS } from "@/api/endpoints";
import type { Rol } from "@/types/persona.types";
import type { ApiResponse } from "@/types/auth.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

/**
 * Servicio de catálogos (roles, etc.)
 */
export const catalogoService = {
    async getRoles(): Promise<Rol[]> {
        try {
            const { data } = await apiClient.get<ApiResponse<Rol[]>>(
                CATALOGO_ENDPOINTS.roles
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener roles");
            }

            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
