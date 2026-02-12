import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { LOTE_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/auth.types";
import type { PaginatedResponse } from "@/types/usuario.types";

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
    fechafabricacion: string;
    medicamento?: { nombre: string; codigomedicamento: string };
}

export interface CreateLoteRequest {
    codigolote: string;
    codigomedicamento: string;
    fechavencimiento: string;
    fechafabricacion: string;
}

/** Nomenclatura obligatoria: LOT-YYYYMMDD-NNN (ej: LOT-20250211-001) */
export const LOTE_NOMENCLATURA_REGEX = /^LOT-\d{8}-\d{3}$/;

export function isValidLoteCodigo(codigo: string): boolean {
    return LOTE_NOMENCLATURA_REGEX.test(codigo);
}

export function sugerirCodigoLote(index: number): string {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const seq = String(index).padStart(3, "0");
    return `LOT-${today}-${seq}`;
}

/**
 * Servicio de lotes
 */
export const loteService = {
    async createLote(payload: CreateLoteRequest): Promise<Lote> {
        try {
            if (!isValidLoteCodigo(payload.codigolote)) {
                throw new Error(
                    "Código de lote inválido. Formato obligatorio: LOT-YYYYMMDD-NNN (ej: LOT-20250211-001)"
                );
            }
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

    async getLotes(params?: {
        page?: number;
        limit?: number;
        medicamento?: string;
    }): Promise<PaginatedResponse<Lote>> {
        try {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set("page", String(params.page));
            if (params?.limit) searchParams.set("limit", String(params.limit ?? 500));
            if (params?.medicamento) searchParams.set("medicamento", params.medicamento);

            const { data } = await apiClient.get<
                ApiResponse<Lote[]> & { pagination: PaginatedResponse<Lote>["pagination"] }
            >(`${LOTE_ENDPOINTS.lotes}?${searchParams}`);

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener lotes");
            }

            return {
                data: data.data,
                pagination: data.pagination ?? { total: data.data.length, page: 1, limit: 100, totalPages: 1 },
            };
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
