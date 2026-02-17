import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { LOTE_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/auth.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

export interface Lote {
    codigolote: string;
    codigomedicamento: string;
    fechavencimiento: string;
    fechafabricacion?: string;
    medicamento?: {
        codigomedicamento: string;
        nombre: string;
        descripcion?: string;
        compuesto_principal?: string;
    };
    almacen_medicamento?: Array<{
        idalmacen: number;
        cantidad: number;
        almacen?: { idalmacen: number; nombre: string };
    }>;
}

export interface LotesPaginados {
    data: Lote[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

/** Sugiere un código de lote con formato LOT-YYYYMMDD-NNN */
export function sugerirCodigoLote(index: number): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const seq = String(index).padStart(3, "0");
    return `LOT-${yyyy}${mm}${dd}-${seq}`;
}

/** Valida que el código de lote tenga el formato LOT-YYYYMMDD-NNN */
export function isValidLoteCodigo(codigo: string): boolean {
    return /^LOT-\d{8}-\d{3}$/.test(codigo);
}

export const loteService = {
    async getLotes(params?: {
        page?: number;
        limit?: number;
        medicamento?: string;
        vencidos?: boolean;
    }): Promise<LotesPaginados> {
        try {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set("page", String(params.page));
            if (params?.limit) searchParams.set("limit", String(params.limit));
            if (params?.medicamento) searchParams.set("medicamento", params.medicamento);
            if (params?.vencidos !== undefined) searchParams.set("vencidos", String(params.vencidos));

            const url = searchParams.toString()
                ? `${LOTE_ENDPOINTS.lotes}?${searchParams}`
                : LOTE_ENDPOINTS.lotes;

            const { data } = await apiClient.get<
                ApiResponse<Lote[]> & { pagination?: LotesPaginados["pagination"] }
            >(url);

            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al obtener lotes");
            }
            return {
                data: data.data ?? [],
                pagination: (data as any).pagination ?? {
                    total: (data.data ?? []).length,
                    page: params?.page ?? 1,
                    limit: params?.limit ?? 20,
                    totalPages: 1,
                },
            };
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async createLote(payload: {
        codigolote: string;
        codigomedicamento: string;
        fechavencimiento: string;
        fechafabricacion: string;
    }): Promise<Lote> {
        try {
            const { data } = await apiClient.post<ApiResponse<Lote>>(
                LOTE_ENDPOINTS.lotes,
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al crear lote");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async deleteLote(codigolote: string): Promise<void> {
        try {
            const { data } = await apiClient.delete<ApiResponse>(
                LOTE_ENDPOINTS.loteById(codigolote)
            );
            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al eliminar lote");
            }
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
