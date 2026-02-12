import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { PROVEEDOR_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/auth.types";
import type {
    Proveedor,
    CreateProveedorRequest,
    UpdateProveedorRequest,
    ProveedoresQuery,
    ProveedorStats,
} from "@/types/proveedor.types";
import type { PaginatedResponse } from "@/types/usuario.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

/**
 * Servicio de proveedores
 * Gestiona CRUD según proveedorController
 */
export const proveedorService = {
    async getProveedores(query?: ProveedoresQuery): Promise<PaginatedResponse<Proveedor>> {
        try {
            const params = new URLSearchParams();
            if (query?.page) params.set("page", String(query.page));
            if (query?.limit) params.set("limit", String(query.limit));
            if (query?.search) params.set("search", query.search);

            const { data } = await apiClient.get<
                ApiResponse<Proveedor[]> & { pagination: PaginatedResponse<Proveedor>["pagination"] }
            >(PROVEEDOR_ENDPOINTS.proveedores, { params });

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener proveedores");
            }

            return {
                data: data.data,
                pagination: data.pagination,
            };
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async getProveedorById(rncproveedor: string): Promise<Proveedor> {
        try {
            const { data } = await apiClient.get<ApiResponse<Proveedor>>(
                PROVEEDOR_ENDPOINTS.proveedorById(rncproveedor)
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Proveedor no encontrado");
            }

            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async createProveedor(payload: CreateProveedorRequest): Promise<Proveedor> {
        try {
            const { data } = await apiClient.post<ApiResponse<Proveedor>>(
                PROVEEDOR_ENDPOINTS.proveedores,
                payload
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al crear proveedor");
            }

            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async updateProveedor(
        rncproveedor: string,
        payload: UpdateProveedorRequest
    ): Promise<Proveedor> {
        try {
            const { data } = await apiClient.put<ApiResponse<Proveedor>>(
                PROVEEDOR_ENDPOINTS.proveedorById(rncproveedor),
                payload
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al actualizar proveedor");
            }

            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async deleteProveedor(rncproveedor: string): Promise<void> {
        try {
            const { data } = await apiClient.delete<ApiResponse>(
                PROVEEDOR_ENDPOINTS.proveedorById(rncproveedor)
            );

            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al eliminar proveedor");
            }
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async getProveedorStats(rncproveedor: string): Promise<ProveedorStats> {
        try {
            const { data } = await apiClient.get<ApiResponse<ProveedorStats>>(
                PROVEEDOR_ENDPOINTS.proveedorStats(rncproveedor)
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener estadísticas");
            }

            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
