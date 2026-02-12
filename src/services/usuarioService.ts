import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { PERSONA_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/auth.types";
import type {
    Usuario,
    CreateUsuarioRequest,
    UpdateUsuarioRequest,
    UsuariosQuery,
    PaginatedResponse,
} from "@/types/usuario.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

/**
 * Servicio de usuarios
 * Gestiona CRUD de usuarios según personaController
 */
export const usuarioService = {
    async getUsuarios(query?: UsuariosQuery): Promise<PaginatedResponse<Usuario>> {
        try {
            const params = new URLSearchParams();
            if (query?.page) params.set("page", String(query.page));
            if (query?.limit) params.set("limit", String(query.limit));
            if (query?.search) params.set("search", query.search);

            const { data } = await apiClient.get<
                ApiResponse<Usuario[]> & { pagination: PaginatedResponse<Usuario>["pagination"] }
            >(PERSONA_ENDPOINTS.usuarios, { params });

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener usuarios");
            }

            return {
                data: data.data,
                pagination: data.pagination,
            };
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async getUsuarioById(idusuario: number): Promise<Usuario> {
        try {
            const { data } = await apiClient.get<ApiResponse<Usuario>>(
                PERSONA_ENDPOINTS.usuarioById(idusuario)
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Usuario no encontrado");
            }

            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async createUsuario(payload: CreateUsuarioRequest): Promise<Usuario> {
        try {
            const { data } = await apiClient.post<ApiResponse<Usuario>>(
                PERSONA_ENDPOINTS.usuarios,
                payload
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al crear usuario");
            }

            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async updateUsuario(idusuario: number, payload: UpdateUsuarioRequest): Promise<Usuario> {
        try {
            const { data } = await apiClient.put<ApiResponse<Usuario>>(
                PERSONA_ENDPOINTS.usuarioById(idusuario),
                payload
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al actualizar usuario");
            }

            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async deleteUsuario(idusuario: number): Promise<void> {
        try {
            const { data } = await apiClient.delete<ApiResponse>(
                PERSONA_ENDPOINTS.usuarioById(idusuario)
            );

            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al eliminar usuario");
            }
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
