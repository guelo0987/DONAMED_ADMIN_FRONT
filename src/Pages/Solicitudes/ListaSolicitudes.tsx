import { useMemo, useState } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

// Estados según tipo_estado_solicitud de la DB
type EstadoSolicitud =
    | "PENDIENTE"
    | "APROBADA"
    | "RECHAZADA"
    | "DESPACHADA"
    | "EN_REVISION"
    | "CANCELADA"
    | "INCOMPLETA";

interface Solicitud {
    numerosolicitud: number;
    idusuario: number;
    cedularepresentante: string | null;
    codigotiposolicitud: string;
    idcentro: number;
    relacion_solicitante: string | null;
    patologia: string;
    estado: EstadoSolicitud;
    creada_en: string;
    solicitante?: string;
    centroMedico?: string;
    tipoSolicitud?: string;
}

// Datos de ejemplo alineados con el esquema de la base de datos
const solicitudesData: Solicitud[] = [
    {
        numerosolicitud: 1,
        idusuario: 1,
        cedularepresentante: "0912345678",
        codigotiposolicitud: "URGENTE",
        idcentro: 1,
        relacion_solicitante: "Madre",
        patologia: "Diabetes tipo 2",
        estado: "PENDIENTE",
        creada_en: "2025-02-10T10:30:00",
        solicitante: "María del Carmen",
        centroMedico: "Centro Médico Norte",
        tipoSolicitud: "Urgente",
    },
    {
        numerosolicitud: 2,
        idusuario: 1,
        cedularepresentante: "0801234567",
        codigotiposolicitud: "PROGRAMADA",
        idcentro: 2,
        relacion_solicitante: "Tutor",
        patologia: "Hipertensión",
        estado: "APROBADA",
        creada_en: "2025-02-09T14:20:00",
        solicitante: "María del Carmen",
        centroMedico: "Clínica Horizonte",
        tipoSolicitud: "Programada",
    },
    {
        numerosolicitud: 3,
        idusuario: 2,
        cedularepresentante: "1723456789",
        codigotiposolicitud: "URGENTE",
        idcentro: 1,
        relacion_solicitante: "Paciente",
        patologia: "Asma bronquial",
        estado: "DESPACHADA",
        creada_en: "2025-02-08T09:15:00",
        solicitante: "Luis Andrade",
        centroMedico: "Hospital Central",
        tipoSolicitud: "Urgente",
    },
    {
        numerosolicitud: 4,
        idusuario: 1,
        cedularepresentante: null,
        codigotiposolicitud: "PROGRAMADA",
        idcentro: 1,
        relacion_solicitante: "Paciente",
        patologia: "Epilepsia",
        estado: "EN_REVISION",
        creada_en: "2025-02-11T08:00:00",
        solicitante: "Ana Pérez",
        centroMedico: "Centro Médico Norte",
        tipoSolicitud: "Programada",
    },
];

const statusStyles: Record<EstadoSolicitud, string> = {
    PENDIENTE: "bg-warning-light text-warning",
    APROBADA: "bg-success-light text-success",
    RECHAZADA: "bg-danger-light text-danger",
    DESPACHADA: "bg-donamed-light text-donamed-dark",
    EN_REVISION: "bg-pending-light text-pending",
    CANCELADA: "bg-danger-light text-danger",
    INCOMPLETA: "bg-warning-light text-warning",
};

const estadoLabels: Record<EstadoSolicitud, string> = {
    PENDIENTE: "Pendiente",
    APROBADA: "Aprobada",
    RECHAZADA: "Rechazada",
    DESPACHADA: "Despachada",
    EN_REVISION: "En revisión",
    CANCELADA: "Cancelada",
    INCOMPLETA: "Incompleta",
};

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function ListaSolicitudes() {
    const [searchTerm, setSearchTerm] = useState("");
    const [estado, setEstado] = useState<EstadoSolicitud | "all">("all");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const filteredSolicitudes = useMemo(() => {
        return solicitudesData.filter((s) => {
            const matchesSearch =
                searchTerm.trim() === "" ||
                s.numerosolicitud.toString().includes(searchTerm) ||
                (s.solicitante?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                s.patologia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.centroMedico?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
            const matchesEstado = estado === "all" || s.estado === estado;
            const matchesFechaDesde =
                fechaDesde === "" || new Date(s.creada_en) >= new Date(fechaDesde);
            const matchesFechaHasta =
                fechaHasta === "" || new Date(s.creada_en) <= new Date(fechaHasta + "T23:59:59");

            return matchesSearch && matchesEstado && matchesFechaDesde && matchesFechaHasta;
        });
    }, [searchTerm, estado, fechaDesde, fechaHasta]);

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Solicitudes</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Gestiona y visualiza las solicitudes de medicamentos según el centro médico.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex h-10 items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-4 text-sm font-medium text-[#5B5B5B] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                    <span>Filtros</span>
                    <ChevronDown
                        className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                    />
                </button>
            </div>

            {/* Main Card */}
            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <div className="flex items-center gap-3 text-sm text-[#5B5B5B]/80">
                            <span className="rounded-full bg-donamed-light px-3 py-1 text-xs font-semibold text-donamed-dark">
                                {filteredSolicitudes.length} resultados
                            </span>
                            <span>Actualizado hoy</span>
                        </div>

                        {/* Search Bar */}
                        <div className="group flex h-11 w-[260px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por número, solicitante, patología o centro"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="border-b border-[#EEF1F4] bg-white px-6 py-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="flex flex-col gap-2 text-sm">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                        Estado
                                    </span>
                                    <select
                                        value={estado}
                                        onChange={(e) =>
                                            setEstado(e.target.value as EstadoSolicitud | "all")
                                        }
                                        className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    >
                                        <option value="all">Todos</option>
                                        {(Object.keys(estadoLabels) as EstadoSolicitud[]).map(
                                            (e) => (
                                                <option key={e} value={e}>
                                                    {estadoLabels[e]}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 text-sm">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                        Fecha desde
                                    </span>
                                    <input
                                        type="date"
                                        value={fechaDesde}
                                        onChange={(e) => setFechaDesde(e.target.value)}
                                        className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 text-sm">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                        Fecha hasta
                                    </span>
                                    <input
                                        type="date"
                                        value={fechaHasta}
                                        onChange={(e) => setFechaHasta(e.target.value)}
                                        className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="w-full">
                        {/* Header */}
                        <div className="grid grid-cols-[0.8fr_1.2fr_1fr_1fr_1fr_1fr_0.8fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>N° Solicitud</span>
                            <span>Solicitante / Centro</span>
                            <span>Patología</span>
                            <span>Tipo</span>
                            <span>Fecha</span>
                            <span>Estado</span>
                            <span>Acciones</span>
                        </div>

                        {/* Rows */}
                        {filteredSolicitudes.map((solicitud) => (
                            <div
                                key={solicitud.numerosolicitud}
                                className="grid grid-cols-[0.8fr_1.2fr_1fr_1fr_1fr_1fr_0.8fr] gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-donamed-primary" />
                                    <span className="font-medium">S-{solicitud.numerosolicitud}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">{solicitud.solicitante}</span>
                                    <span className="text-xs text-[#5B5B5B]/70">
                                        {solicitud.centroMedico}
                                    </span>
                                </div>
                                <span className="truncate" title={solicitud.patologia}>
                                    {solicitud.patologia}
                                </span>
                                <span>{solicitud.tipoSolicitud}</span>
                                <span>{formatDate(solicitud.creada_en)}</span>
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[solicitud.estado]}`}
                                >
                                    {estadoLabels[solicitud.estado]}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/solicitudes/${solicitud.numerosolicitud}`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                        title="Ver detalle"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                    {solicitud.estado === "APROBADA" && (
                                        <Link
                                            to={`/despachos/S-${solicitud.numerosolicitud}`}
                                            className="inline-flex h-9 items-center justify-center rounded-xl bg-donamed-primary px-3 text-xs font-semibold text-white transition hover:bg-donamed-dark"
                                        >
                                            Despachar
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Empty State */}
                        {filteredSolicitudes.length === 0 && (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No se encontraron solicitudes
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
