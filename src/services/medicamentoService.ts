import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { MEDICAMENTO_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/auth.types";
import type { PaginatedResponse } from "@/types/usuario.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

/** Lote con stock por almacén (respuesta getMedicamentoById) */
export interface LoteConAlmacen {
    codigolote: string;
    fechavencimiento: string;
    fechafabricacion?: string;
    almacen_medicamento: Array<{
        idalmacen: number;
        codigolote: string;
        cantidad: number;
        almacen?: { idalmacen: number; nombre: string };
    }>;
}

/** Stock por almacén aplanado para UI */
export interface StockPorAlmacen {
    idalmacen: number;
    codigolote: string;
    cantidad: number;
    nombreAlmacen: string;
    fechavencimiento: string;
}

export interface Medicamento {
    codigomedicamento: string;
    nombre: string;
    descripcion?: string | null;
    compuesto_principal?: string | null;
    estado?: "ACTIVO" | "INACTIVO" | null;
    idvia_administracion?: number | null;
    idforma_farmaceutica?: number | null;
    via_administracion?: { idvia: number; nombre: string } | null;
    forma_farmaceutica?: { idformafarmaceutica: number; nombre: string } | null;
    categoria_medicamento?: { idcategoria: number; categoria?: { nombre: string } }[];
    enfermedad_medicamento?: { idenfermedad: number; enfermedad?: { nombre: string } }[];
    cantidad_disponible_global?: number | null;
    /** Lotes con almacen_medicamento (getMedicamentoById) */
    lote?: LoteConAlmacen[];
    creado_en?: string | null;
    actualizado_en?: string | null;
}

/** Aplana lote[] -> stock por almacén para la UI */
export function flattenStockFromLotes(
    lotes: LoteConAlmacen[] | undefined
): StockPorAlmacen[] {
    if (!lotes?.length) return [];
    return lotes.flatMap((l) =>
        (l.almacen_medicamento ?? []).map((am) => ({
            idalmacen: am.idalmacen,
            codigolote: l.codigolote,
            cantidad: am.cantidad,
            nombreAlmacen: am.almacen?.nombre ?? `Almacén #${am.idalmacen}`,
            fechavencimiento: l.fechavencimiento,
        }))
    );
}

export interface CreateMedicamentoRequest {
    codigomedicamento?: string;
    nombre?: string;
    descripcion?: string;
    compuesto_principal?: string;
    idvia_administracion?: number;
    idforma_farmaceutica?: number;
    categorias?: number[];
    enfermedades?: number[];
    estado?: "ACTIVO" | "INACTIVO";
}

/**
 * Servicio de medicamentos
 */
export const medicamentoService = {
    async getMedicamentos(params?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<PaginatedResponse<Medicamento>> {
        try {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set("page", String(params.page));
            if (params?.limit) searchParams.set("limit", String(params.limit));
            if (params?.search) searchParams.set("search", params.search);

            const { data } = await apiClient.get<
                ApiResponse<Medicamento[]> & { pagination: PaginatedResponse<Medicamento>["pagination"] }
            >(`${MEDICAMENTO_ENDPOINTS.medicamentos}?${searchParams}`);

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener medicamentos");
            }

            return {
                data: data.data,
                pagination: data.pagination ?? { total: data.data.length, page: 1, limit: 20, totalPages: 1 },
            };
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async getMedicamentoById(codigo: string): Promise<Medicamento> {
        try {
            const { data } = await apiClient.get<ApiResponse<Medicamento>>(
                MEDICAMENTO_ENDPOINTS.medicamentoById(codigo)
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Medicamento no encontrado");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async createMedicamento(payload: CreateMedicamentoRequest) {
        try {
            const { data } = await apiClient.post<ApiResponse<Medicamento>>(
                MEDICAMENTO_ENDPOINTS.medicamentos,
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al crear medicamento");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async updateMedicamento(codigo: string, payload: Partial<CreateMedicamentoRequest>) {
        try {
            const { data } = await apiClient.put<ApiResponse<Medicamento>>(
                MEDICAMENTO_ENDPOINTS.medicamentoById(codigo),
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al actualizar medicamento");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async deleteMedicamento(codigo: string) {
        try {
            const { data } = await apiClient.delete<ApiResponse>(
                MEDICAMENTO_ENDPOINTS.medicamentoById(codigo)
            );
            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al eliminar medicamento");
            }
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
