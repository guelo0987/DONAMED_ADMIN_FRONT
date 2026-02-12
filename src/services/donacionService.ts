import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { DONACION_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/auth.types";
import type { PaginatedResponse } from "@/types/usuario.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

export interface DonacionMedicamento {
    numerodonacion: number;
    idalmacen: number;
    codigolote: string;
    cantidad: number;
    lote?: { codigolote: string; medicamento?: { nombre: string } };
    almacen?: { nombre: string };
}

export interface Donacion {
    numerodonacion: number;
    proveedor?: string | null;
    fecha_recibida: string;
    descripcion?: string | null;
    proveedor_donaciones_proveedorToproveedor?: { nombre: string; rncproveedor: string } | null;
    donacion_medicamento?: DonacionMedicamento[];
}

export interface CreateDonacionRequest {
    proveedor?: string;
    descripcion?: string;
    medicamentos?: Array<{
        idalmacen: number;
        codigolote: string;
        cantidad: number;
    }>;
}

/**
 * Servicio de donaciones
 */
export const donacionService = {
    async getDonaciones(params?: {
        page?: number;
        limit?: number;
        proveedor?: string;
    }): Promise<PaginatedResponse<Donacion>> {
        try {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set("page", String(params.page));
            if (params?.limit) searchParams.set("limit", String(params.limit));
            if (params?.proveedor) searchParams.set("proveedor", params.proveedor);

            const { data } = await apiClient.get<
                ApiResponse<Donacion[]> & { pagination: PaginatedResponse<Donacion>["pagination"] }
            >(`${DONACION_ENDPOINTS.donaciones}?${searchParams}`);

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener donaciones");
            }

            return {
                data: data.data,
                pagination: data.pagination ?? { total: data.data.length, page: 1, limit: 20, totalPages: 1 },
            };
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async getDonacionById(numerodonacion: number): Promise<Donacion> {
        try {
            const { data } = await apiClient.get<ApiResponse<Donacion>>(
                DONACION_ENDPOINTS.donacionById(numerodonacion)
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Donación no encontrada");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async createDonacion(payload: CreateDonacionRequest): Promise<Donacion> {
        try {
            const { data } = await apiClient.post<ApiResponse<Donacion>>(
                DONACION_ENDPOINTS.donaciones,
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al crear donación");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async updateDonacion(
        numerodonacion: number,
        payload: { proveedor?: string; descripcion?: string }
    ): Promise<Donacion> {
        try {
            const { data } = await apiClient.put<ApiResponse<Donacion>>(
                DONACION_ENDPOINTS.donacionById(numerodonacion),
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al actualizar donación");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async deleteDonacion(numerodonacion: number): Promise<void> {
        try {
            const { data } = await apiClient.delete<ApiResponse>(
                DONACION_ENDPOINTS.donacionById(numerodonacion)
            );
            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al eliminar donación");
            }
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async addMedicamentosToDonacion(
        numerodonacion: number,
        medicamentos: Array<{ idalmacen: number; codigolote: string; cantidad: number }>
    ): Promise<Donacion> {
        try {
            const { data } = await apiClient.post<ApiResponse<Donacion>>(
                DONACION_ENDPOINTS.addMedicamentos(numerodonacion),
                { medicamentos }
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al agregar medicamentos");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
