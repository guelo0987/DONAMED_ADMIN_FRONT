import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { SOLICITUD_ENDPOINTS } from "@/api/endpoints/solicitudEndpoints";
import type { ApiResponse } from "@/types/auth.types";
import type {
    Solicitud,
    EstadoSolicitud,
    DetalleSolicitudItem,
} from "@/types/solicitud.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

export interface SolicitudesPaginadas {
    data: Solicitud[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface DetallePayload {
    idalmacen: number;
    codigolote: string;
    cantidad: number;
    dosis_indicada: string;
    tiempo_tratamiento: string;
}

/**
 * Servicio de solicitudes
 */
export const solicitudService = {
    async getSolicitudes(params?: {
        page?: number;
        limit?: number;
        estado?: EstadoSolicitud;
    }): Promise<SolicitudesPaginadas> {
        try {
            const { data } = await apiClient.get<ApiResponse<Solicitud[]> & { pagination?: SolicitudesPaginadas["pagination"] }>(
                SOLICITUD_ENDPOINTS.solicitudes,
                { params }
            );
            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al obtener solicitudes");
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

    async getSolicitudById(numerosolicitud: number): Promise<Solicitud> {
        try {
            const { data } = await apiClient.get<ApiResponse<Solicitud>>(
                SOLICITUD_ENDPOINTS.solicitudById(numerosolicitud)
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener solicitud");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async updateSolicitudEstado(
        numerosolicitud: number,
        payload: { estado: EstadoSolicitud; observaciones?: string }
    ): Promise<Solicitud> {
        try {
            const { data } = await apiClient.patch<ApiResponse<Solicitud>>(
                SOLICITUD_ENDPOINTS.solicitudEstado(numerosolicitud),
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al actualizar estado");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    // ===================== Detalle de Solicitud (asignación de medicamentos reales) =====================

    async getDetallesSolicitud(numerosolicitud: number): Promise<DetalleSolicitudItem[]> {
        try {
            const { data } = await apiClient.get<ApiResponse<DetalleSolicitudItem[]>>(
                SOLICITUD_ENDPOINTS.solicitudDetalles(numerosolicitud)
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener detalles");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async asignarDetalles(
        numerosolicitud: number,
        detalles: DetallePayload[]
    ): Promise<DetalleSolicitudItem[]> {
        try {
            const { data } = await apiClient.patch<ApiResponse<DetalleSolicitudItem[]>>(
                SOLICITUD_ENDPOINTS.solicitudDetalles(numerosolicitud),
                { detalles }
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al asignar medicamentos");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async eliminarDetalles(numerosolicitud: number): Promise<void> {
        try {
            const { data } = await apiClient.delete<ApiResponse>(
                SOLICITUD_ENDPOINTS.solicitudDetalles(numerosolicitud)
            );
            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al eliminar detalles");
            }
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
