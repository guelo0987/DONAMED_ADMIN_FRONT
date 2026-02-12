import { AxiosError } from "axios";
import { apiClient, setStoredToken } from "@/api";
import { AUTH_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse, LoginRequest, LoginResponse } from "@/types/auth.types";

function getErrorMessage(err: unknown): string {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse;
        return data.error?.message ?? err.message ?? "Error de conexión";
    }
    return err instanceof Error ? err.message : "Error al iniciar sesión";
}

/**
 * Servicio de autenticación
 * Maneja login, refresh token y perfil según authController del backend
 */
export const authService = {
    /**
     * Iniciar sesión de administrador
     * POST /api/v1/admin/auth/login
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
                AUTH_ENDPOINTS.login,
                credentials
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al iniciar sesión");
            }

            const result = data.data;
            setStoredToken(result.token);
            return result;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    /**
     * Refrescar token
     * POST /api/v1/admin/auth/refresh
     */
    async refreshToken(): Promise<{ token: string }> {
        try {
            const { data } = await apiClient.post<ApiResponse<{ token: string }>>(
                AUTH_ENDPOINTS.refresh
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al refrescar token");
            }

            setStoredToken(data.data.token);
            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },

    /**
     * Obtener perfil del administrador logueado
     * GET /api/v1/admin/auth/me
     */
    async getProfile(): Promise<LoginResponse["usuario"]> {
        try {
            const { data } = await apiClient.get<ApiResponse<LoginResponse["usuario"]>>(
                AUTH_ENDPOINTS.me
            );

            if (!data.success || !data.data) {
                throw new Error(data.error?.message ?? "Error al obtener perfil");
            }

            return data.data;
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    },
};
