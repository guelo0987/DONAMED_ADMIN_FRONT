/**
 * Tipos para el módulo de Solicitudes y Medicamentos Solicitados
 */

export type EstadoSolicitud =
    | "PENDIENTE"
    | "APROBADA"
    | "RECHAZADA"
    | "DESPACHADA"
    | "EN_REVISION"
    | "CANCELADA"
    | "INCOMPLETA";

export interface TipoSolicitud {
    codigotiposolicitud: string;
    descripcion: string;
}

export interface PersonaSolicitud {
    cedula: string;
    nombre: string;
    apellidos: string;
    sexo?: "M" | "F";
    telefono?: string;
    telefono_alternativo?: string;
    codigociudad?: string;
    direccion?: string;
    fecha_nacimiento?: string;
}

export interface RolUsuario {
    codigorol: number;
    nombre: string;
}

export interface UsuarioSolicitud {
    idusuario: number;
    correo: string;
    cedula_usuario?: string;
    codigo_rol?: number;
    estado?: string;
    foto_url?: string | null;
    persona?: PersonaSolicitud;
    rol?: RolUsuario;
}

export interface MedicamentoSolicitado {
    id: number;
    numerosolicitud: number;
    nombre: string;
    dosis?: string | null;
    creado_en: string;
}

export interface DetalleSolicitudItem {
    numerosolicitud: number;
    idalmacen: number;
    codigolote: string;
    cantidad: number;
    dosis_indicada: string;
    tiempo_tratamiento: string;
    lote?: {
        codigolote: string;
        medicamento?: {
            codigomedicamento: string;
            nombre: string;
        };
    };
    almacen?: {
        idalmacen: number;
        nombre: string;
    };
}

export interface DespachoSolicitud {
    numerodespacho: number;
    solicitud: number;
    fecha_despacho: string;
    cedula_recibe: string;
    persona?: PersonaSolicitud;
}

/** Almacén de retiro asignado a una solicitud aprobada */
export interface AlmacenRetiro {
    idalmacen: number;
    nombre: string;
    direccion?: string | null;
    telefono?: string | null;
    correo?: string | null;
    ciudad?: {
        codigociudad: string;
        nombre: string;
    } | null;
}

export interface DocumentoSolicitud {
    nombre?: string;
    url?: string;
    tipo?: string;
    [key: string]: unknown;
}

export interface Solicitud {
    numerosolicitud: number;
    idusuario: number;
    cedularepresentante: string | null;
    codigotiposolicitud: string;
    centromedico: string;
    relacion_solicitante: string | null;
    patologia: string;
    documentos: DocumentoSolicitud[] | unknown;
    estado: EstadoSolicitud;
    creada_en: string;
    actualizado_en: string;
    observaciones: string | null;
    usuario?: UsuarioSolicitud;
    persona?: PersonaSolicitud | null;
    tipo_solicitud?: TipoSolicitud;
    medicamento_solicitado?: MedicamentoSolicitado[];
    detalle_solicitud?: DetalleSolicitudItem[];
    despacho_despacho_solicitudTosolicitud?: DespachoSolicitud | null;
    /** Almacén donde el cliente retirará los medicamentos (asignado al aprobar) */
    almacen_retiro?: AlmacenRetiro | null;
}
