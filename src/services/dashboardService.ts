import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { DASHBOARD_ENDPOINTS } from "@/api/endpoints/dashboardEndpoints";
import type { ApiResponse } from "@/types/auth.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

export interface DashboardCards {
    totalDonaciones: number;
    solicitudes: { total: number; variacion: number };
    aprobaciones: { total: number; variacion: number };
    nuevosRegistros: { total: number; variacion: number };
}

export interface SolicitudReciente {
    numero: number;
    numeroSolicitud: string;
    fecha: string;
    nombreSolicitante: string;
    estado: string;
}

export interface MonthlyStat {
    mes: string;
    total: number;
}

export interface DayStat {
    dia: string;
    solicitudes: number;
    medicamentos: number;
}

export interface DashboardData {
    cards: DashboardCards;
    solicitudesVsMedicamentos: { solicitudes: number; medicamentos: number };
    solicitudesRecientes: SolicitudReciente[];
    solicitudesEntrantes: { esteMes: number; mesAnterior: number };
    insights: {
        donaciones: MonthlyStat[];
        usuarios: MonthlyStat[];
        solicitudes: MonthlyStat[];
    };
    solicitudesPorDia: DayStat[];
}

export const dashboardService = {
    async getStats(): Promise<DashboardData> {
        try {
            const { data } = await apiClient.get<ApiResponse<DashboardData>>(
                DASHBOARD_ENDPOINTS.stats
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
