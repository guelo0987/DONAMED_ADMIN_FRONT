/**
 * Tipos para el módulo de Usuarios
 * Alineados con tabla usuario, persona y rol
 */

import type { Persona, Rol } from "./persona.types";

export type EstadoUsuario = "ACTIVO" | "INACTIVO" | "ELIMINADO";

export interface Usuario {
    idusuario: number;
    correo: string;
    cedula_usuario: string | null;
    codigo_rol: number | null;
    ultimo_ingreso: string | null;
    creado_en: string | null;
    actualizado_en: string | null;
    estado: EstadoUsuario | null;
    persona: Persona | null;
    rol: Rol | null;
}

export interface CreateUsuarioRequest {
    correo: string;
    contrasena: string;
    cedula_usuario?: string;
    codigo_rol?: number;
}

export interface UpdateUsuarioRequest {
    correo?: string;
    contrasena?: string;
    codigo_rol?: number;
    estado?: "ACTIVO" | "INACTIVO";
}

export interface UsuariosQuery {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
