/**
 * Tipos para el módulo de autenticación
 * Alineados con la base de datos y el backend
 */

// Rol (tabla rol)
export interface Rol {
    codigorol: number;
    nombre: string;
}

// Persona (tabla persona - cedula_usuario del usuario)
export interface Persona {
    cedula: string;
    nombre: string;
    apellidos: string;
    sexo: "M" | "F" | null;
    fecha_nacimiento: string | null;
    telefono: string | null;
    telefono_alternativo: string | null;
    direccion: string | null;
}

// Usuario retornado por login (tabla usuario + persona + rol)
export interface UsuarioAuth {
    idusuario: number;
    correo: string;
    codigo_rol: number | null;
    persona: Persona | null;
    rol: Rol | null;
}

// Request de login
export interface LoginRequest {
    correo: string;
    contrasena: string;
}

// Response de login
export interface LoginResponse {
    token: string;
    usuario: UsuarioAuth;
}

// Response genérica de la API
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        message: string;
    };
}
