import axios, { AxiosError } from "axios";
import { API_CONFIG } from "./config";

/**
 * Cliente HTTP para la API DONAMED
 * Incluye interceptores para token y manejo de errores
 */
export const apiClient = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
        "Content-Type": "application/json",
    },
});

// Token storage key
const TOKEN_KEY = "donamed_token";

export function getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

// Interceptor: agregar token a las peticiones
apiClient.interceptors.request.use((config) => {
    const token = getStoredToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor: manejar errores de respuesta (401 → logout)
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            clearStoredToken();
            // Redirigir a login si estamos en una ruta protegida
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);
