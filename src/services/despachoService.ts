import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { DESPACHO_ENDPOINTS } from "@/api/endpoints/despachoEndpoints";
import type { ApiResponse } from "@/types/auth.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

export interface Despacho {
    numerodespacho: number;
    solicitud: number;
    fecha_despacho: string;
    cedula_recibe: string;
    persona?: {
        cedula: string;
        nombre: string;
        apellidos: string;
        telefono?: string;
        codigociudad?: string;
    };
    solicitud_despacho_solicitudTosolicitud?: {
        numerosolicitud: number;
        idusuario: number;
        cedularepresentante: string | null;
        codigotiposolicitud: string;
        centromedico: string;
        relacion_solicitante: string | null;
        patologia: string;
        estado: string;
        creada_en: string;
        actualizado_en: string;
        observaciones: string | null;
        documentos: unknown;
        usuario?: {
            idusuario: number;
            correo: string;
            persona?: {
                cedula: string;
                nombre: string;
                apellidos: string;
                telefono?: string;
            };
        };
        persona?: {
            cedula: string;
            nombre: string;
            apellidos: string;
        } | null;
        tipo_solicitud?: {
            codigotiposolicitud: string;
            descripcion: string;
        };
        medicamento_solicitado?: Array<{
            id: number;
            numerosolicitud: number;
            nombre: string;
            dosis?: string | null;
            creado_en: string;
        }>;
        detalle_solicitud?: Array<{
            numerosolicitud: number;
            idalmacen: number;
            codigolote: string;
            cantidad: number;
            dosis_indicada: string;
            tiempo_tratamiento: string;
            lote?: {
                codigolote: string;
                codigomedicamento?: string;
                fechavencimiento?: string;
                medicamento?: {
                    codigomedicamento: string;
                    nombre: string;
                    descripcion?: string;
                    compuesto_principal?: string;
                };
            };
            almacen?: {
                idalmacen: number;
                nombre: string;
                codigociudad?: string;
            };
        }>;
    };
}

export interface DespachosPaginados {
    data: Despacho[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const despachoService = {
    async getDespachos(params?: {
        page?: number;
        limit?: number;
        solicitud?: number;
    }): Promise<DespachosPaginados> {
        try {
            const { data } = await apiClient.get<ApiResponse<Despacho[]> & { pagination?: DespachosPaginados["pagination"] }>(
                DESPACHO_ENDPOINTS.despachos,
                { params }
            );
            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al obtener despachos");
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

    async getDespachoById(numerodespacho: number): Promise<Despacho> {
        try {
            const { data } = await apiClient.get<ApiResponse<Despacho>>(
                DESPACHO_ENDPOINTS.despachoById(numerodespacho)
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener despacho");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async createDespacho(payload: {
        solicitud: number;
        cedula_recibe: string;
        detalles?: Array<{
            idalmacen: number;
            codigolote: string;
            cantidad: number;
            dosis_indicada: string;
            tiempo_tratamiento: string;
        }>;
    }): Promise<Despacho> {
        try {
            const { data } = await apiClient.post<ApiResponse<Despacho>>(
                DESPACHO_ENDPOINTS.despachos,
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al crear despacho");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async updateDespacho(
        numerodespacho: number,
        payload: { cedula_recibe?: string }
    ): Promise<Despacho> {
        try {
            const { data } = await apiClient.put<ApiResponse<Despacho>>(
                DESPACHO_ENDPOINTS.despachoById(numerodespacho),
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al actualizar despacho");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async deleteDespacho(numerodespacho: number): Promise<void> {
        try {
            const { data } = await apiClient.delete<ApiResponse>(
                DESPACHO_ENDPOINTS.despachoById(numerodespacho)
            );
            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al eliminar despacho");
            }
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
