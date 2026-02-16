import { AxiosError } from "axios";
import { apiClient } from "@/api";
import { CATALOGO_ENDPOINTS } from "@/api/endpoints";
import type { Rol } from "@/types/persona.types";
import type { ApiResponse } from "@/types/auth.types";
import type {
    Categoria,
    Enfermedad,
    ViaAdministracion,
    FormaFarmaceutica,
} from "@/types/catalogo.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error en la operación";
}

/**
 * Servicio de catálogos (roles, categorías, enfermedades, vías, formas farmacéuticas)
 */
export const catalogoService = {
    async getRoles(): Promise<Rol[]> {
        try {
            const { data } = await apiClient.get<ApiResponse<Rol[]>>(
                CATALOGO_ENDPOINTS.roles
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener roles");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async getCategorias(): Promise<Categoria[]> {
        try {
            const { data } = await apiClient.get<ApiResponse<Categoria[]>>(
                CATALOGO_ENDPOINTS.categorias
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener categorías");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async getEnfermedades(): Promise<Enfermedad[]> {
        try {
            const { data } = await apiClient.get<ApiResponse<Enfermedad[]>>(
                CATALOGO_ENDPOINTS.enfermedades
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener enfermedades");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async createCategoria(payload: { nombre: string }): Promise<Categoria> {
        try {
            const { data } = await apiClient.post<ApiResponse<Categoria>>(
                CATALOGO_ENDPOINTS.categorias,
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al crear categoría");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async updateCategoria(idcategoria: number, payload: { nombre: string }): Promise<Categoria> {
        try {
            const { data } = await apiClient.put<ApiResponse<Categoria>>(
                CATALOGO_ENDPOINTS.categoriaById(idcategoria),
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al actualizar categoría");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async deleteCategoria(idcategoria: number): Promise<void> {
        try {
            const { data } = await apiClient.delete<ApiResponse>(
                CATALOGO_ENDPOINTS.categoriaById(idcategoria)
            );
            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al eliminar categoría");
            }
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async createEnfermedad(payload: { nombre: string }): Promise<Enfermedad> {
        try {
            const { data } = await apiClient.post<ApiResponse<Enfermedad>>(
                CATALOGO_ENDPOINTS.enfermedades,
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al crear enfermedad");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async updateEnfermedad(idenfermedad: number, payload: { nombre: string }): Promise<Enfermedad> {
        try {
            const { data } = await apiClient.put<ApiResponse<Enfermedad>>(
                CATALOGO_ENDPOINTS.enfermedadById(idenfermedad),
                payload
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al actualizar enfermedad");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async deleteEnfermedad(idenfermedad: number): Promise<void> {
        try {
            const { data } = await apiClient.delete<ApiResponse>(
                CATALOGO_ENDPOINTS.enfermedadById(idenfermedad)
            );
            if (!data.success) {
                throw new Error(data.error?.message ?? "Error al eliminar enfermedad");
            }
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async getViasAdministracion(): Promise<ViaAdministracion[]> {
        try {
            const { data } = await apiClient.get<ApiResponse<ViaAdministracion[]>>(
                CATALOGO_ENDPOINTS.viasAdministracion
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener vías de administración");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    async getFormasFarmaceuticas(): Promise<FormaFarmaceutica[]> {
        try {
            const { data } = await apiClient.get<ApiResponse<FormaFarmaceutica[]>>(
                CATALOGO_ENDPOINTS.formasFarmaceuticas
            );
            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener formas farmacéuticas");
            }
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
