/**
 * Tipos para catálogos del sistema
 */

export interface Categoria {
    idcategoria: number;
    nombre: string;
}

export interface Enfermedad {
    idenfermedad: number;
    nombre: string;
}

export interface ViaAdministracion {
    idvia: number;
    nombre: string;
}

export interface FormaFarmaceutica {
    idformafarmaceutica: number;
    nombre: string;
}
