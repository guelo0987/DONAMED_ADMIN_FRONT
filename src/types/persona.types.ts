/**
 * Tipos para el módulo de Personas
 * Alineados con tabla persona, ciudad, provincia
 */

export interface Provincia {
    codigoprovincia: string;
    nombre: string;
}

export interface Ciudad {
    codigociudad: string;
    nombre: string;
    codigoprovincia: string;
    provincia?: Provincia;
}

export interface Persona {
    cedula: string;
    nombre: string;
    apellidos: string;
    sexo: "M" | "F" | null;
    fecha_nacimiento: string | null;
    telefono: string | null;
    telefono_alternativo: string | null;
    direccion: string | null;
    codigociudad: string | null;
    ciudad?: Ciudad | null;
}

export interface Rol {
    codigorol: number;
    nombre: string;
}

export interface CreatePersonaRequest {
    cedula: string;
    nombre: string;
    apellidos: string;
    sexo?: "M" | "F";
    fecha_nacimiento?: string;
    telefono?: string;
    telefono_alternativo?: string;
    codigociudad?: string;
    direccion?: string;
}

export interface UpdatePersonaRequest {
    nombre?: string;
    apellidos?: string;
    sexo?: "M" | "F";
    fecha_nacimiento?: string;
    telefono?: string;
    telefono_alternativo?: string;
    codigociudad?: string;
    direccion?: string;
}
