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
    estado?: string | null;
    ciudad?: {
        codigociudad: string;
        nombre: string;
        provincia?: { codigoprovincia: string; nombre: string };
    } | null;
}

export interface AlmacenDetalle extends Almacen {
    almacen_medicamento?: Array<{
        idalmacen: number;
        codigolote: string;
        codigomedicamento: string;
        cantidad: number;
        medicamento?: { codigomedicamento: string; nombre: string };
        lote?: { codigolote: string; fechavencimiento?: string; fechafabricacion?: string };
    }>;
}

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

    async getAlmacenById(id: number): Promise<AlmacenDetalle> {
        try {
            const { data } = await apiClient.get<ApiResponse<AlmacenDetalle>>(
                ALMACEN_ENDPOINTS.almacenById(id)
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Almacén no encontrado");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
