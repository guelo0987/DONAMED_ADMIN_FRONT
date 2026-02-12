import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { ALMACEN_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/auth.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

export interface Almacen {
    idalmacen: number;
    nombre: string;
    codigociudad?: string | null;
    direccion?: string | null;
    telefono?: string | null;
    correo?: string | null;
}

/**
 * Servicio de almacenes
 */
export const almacenService = {
    async getAlmacenes(): Promise<Almacen[]> {
        try {
            const { data } = await apiClient.get<ApiResponse<Almacen[]>>(
                ALMACEN_ENDPOINTS.almacenes
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener almacenes");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
