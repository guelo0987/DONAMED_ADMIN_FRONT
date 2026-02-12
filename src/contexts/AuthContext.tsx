import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { getStoredToken, clearStoredToken } from "@/api";
import type { UsuarioAuth } from "@/types/auth.types";

const USER_KEY = "donamed_user";

export interface AuthUser {
    id: number;
    correo: string;
    nombre?: string;
    rol?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (correo: string, contrasena: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function usuarioToAuthUser(usuario: UsuarioAuth): AuthUser {
    const nombre = usuario.persona
        ? `${usuario.persona.nombre} ${usuario.persona.apellidos}`.trim()
        : usuario.correo.split("@")[0];
    return {
        id: usuario.idusuario,
        correo: usuario.correo,
        nombre: nombre || undefined,
        rol: usuario.rol?.nombre ?? undefined,
    };
}

function saveUser(user: AuthUser | null) {
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(USER_KEY);
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function initAuth() {
            const token = getStoredToken();
            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                const usuario = await authService.getProfile();
                setUser(usuarioToAuthUser(usuario));
                saveUser(usuarioToAuthUser(usuario));
            } catch {
                clearStoredToken();
                setUser(null);
                saveUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        initAuth();
    }, []);

    const login = async (correo: string, contrasena: string) => {
        try {
            const result = await authService.login({ correo: correo.trim(), contrasena });
            const authUser = usuarioToAuthUser(result.usuario);
            setUser(authUser);
            saveUser(authUser);
            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al iniciar sesión";
            return { success: false, error: message };
        }
    };

    const logout = () => {
        clearStoredToken();
        setUser(null);
        saveUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return ctx;
}
