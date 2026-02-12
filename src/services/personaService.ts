import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { PERSONA_ENDPOINTS } from "@/api/endpoints";
import type {
    Persona,
    CreatePersonaRequest,
    UpdatePersonaRequest,
} from "@/types/persona.types";
import type { ApiResponse } from "@/types/auth.types";
import type { PaginatedResponse } from "@/types/usuario.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

interface PersonasQuery {
    page?: number;
    limit?: number;
    search?: string;
}

/**
 * Servicio de personas
 * Gestiona CRUD de personas según personaController
 */
export const personaService = {
    async getPersonas(query?: PersonasQuery): Promise<PaginatedResponse<Persona>> {
        try {
            const params = new URLSearchParams();
            if (query?.page) params.set("page", String(query.page));
            if (query?.limit) params.set("limit", String(query.limit));
            if (query?.search) params.set("search", query.search);

            const { data } = await apiClient.get<
                ApiResponse<Persona[]> & { pagination: PaginatedResponse<Persona>["pagination"] }
            >(PERSONA_ENDPOINTS.personas, { params });

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener personas");
            }

            return {
                data: data.data,
                pagination: data.pagination,
            };
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async getPersonaByCedula(cedula: string): Promise<Persona> {
        try {
            const { data } = await apiClient.get<ApiResponse<Persona>>(
                PERSONA_ENDPOINTS.personaByCedula(cedula)
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Persona no encontrada");
            }

            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async createPersona(payload: CreatePersonaRequest): Promise<Persona> {
        try {
            const { data } = await apiClient.post<ApiResponse<Persona>>(
                PERSONA_ENDPOINTS.personas,
                payload
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al crear persona");
            }

            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async updatePersona(cedula: string, payload: UpdatePersonaRequest): Promise<Persona> {
        try {
            const { data } = await apiClient.put<ApiResponse<Persona>>(
                PERSONA_ENDPOINTS.personaByCedula(cedula),
                payload
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al actualizar persona");
            }

            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
