/**
 * Tipos para el módulo de Proveedores
 * Alineados con tabla proveedor, ciudad, provincia
 */

import type { Ciudad } from "./persona.types";

export interface Proveedor {
    rncproveedor: string;
    nombre: string;
    telefono: string | null;
    correo: string | null;
    codigociudad: string | null;
    direccion: string | null;
    ciudad?: Ciudad | null;
}

export interface CreateProveedorRequest {
    rncproveedor: string;
    nombre: string;
    telefono?: string;
    correo?: string;
    codigociudad?: string;
    direccion?: string;
}

export interface UpdateProveedorRequest {
    nombre?: string;
    telefono?: string;
    correo?: string;
    codigociudad?: string;
    direccion?: string;
}

export interface ProveedoresQuery {
    page?: number;
    limit?: number;
    search?: string;
}

export interface ProveedorStats {
    proveedor: { rncproveedor: string; nombre: string };
    estadisticas: {
        totalDonaciones: number;
        totalMedicamentosDonados: number;
    };
}
