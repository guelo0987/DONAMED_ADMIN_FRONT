import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { INVENTARIO_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/auth.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

export interface InventarioItem {
    idalmacen: number;
    codigolote: string;
    codigomedicamento: string;
    cantidad: number;
    almacen?: { idalmacen: number; nombre: string };
    medicamento?: { codigomedicamento: string; nombre: string; descripcion?: string; compuesto_principal?: string };
    lote?: {
        codigolote: string;
        fechavencimiento?: string;
        fechafabricacion?: string;
    };
}

export interface StockConsolidado {
    nombre: string;
    total: number;
    almacenes: Array<{
        almacen: string;
        lote: string;
        cantidad: number;
    }>;
}

export const inventarioService = {
    async getInventario(params?: {
        almacen?: number;
        medicamento?: string;
    }): Promise<InventarioItem[]> {
        try {
            const searchParams = new URLSearchParams();
            if (params?.almacen) searchParams.set("almacen", String(params.almacen));
            if (params?.medicamento) searchParams.set("medicamento", params.medicamento);

            const url = searchParams.toString()
                ? `${INVENTARIO_ENDPOINTS.inventario}?${searchParams}`
                : INVENTARIO_ENDPOINTS.inventario;
            const { data } = await apiClient.get<
                ApiResponse<InventarioItem[]> & { count?: number }
            >(url);

            if (!data.success || !data.data) {
                return [];
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async ajustarInventario(payload: {
        idalmacen: number;
        codigolote: string;
        codigomedicamento: string;
        cantidad: number;
    }): Promise<InventarioItem> {
        try {
            const { data } = await apiClient.post<ApiResponse<InventarioItem>>(
                INVENTARIO_ENDPOINTS.inventario,
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al ajustar inventario");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async getStockConsolidado(): Promise<StockConsolidado[]> {
        try {
            const { data } = await apiClient.get<ApiResponse<StockConsolidado[]>>(
                INVENTARIO_ENDPOINTS.stockConsolidado
            );
            if (!data.success || !data.data) {
                return [];
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
