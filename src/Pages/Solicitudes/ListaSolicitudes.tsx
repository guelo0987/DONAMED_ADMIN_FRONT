import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Eye, ChevronDown, ChevronLeft, ChevronRight, Filter, X, Pill } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { solicitudService } from "@/services/solicitudService";
import { ubicacionService } from "@/services/ubicacionService";
import type { Solicitud, EstadoSolicitud } from "@/types/solicitud.types";
import type { Provincia, Ciudad } from "@/types/persona.types";

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
    return d.toLocaleDateString("es-DO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function getSolicitanteNombre(solicitud: Solicitud): string {
    const persona = solicitud.usuario?.persona;
    if (persona) return `${persona.nombre} ${persona.apellidos}`;
    return solicitud.usuario?.correo ?? "—";
}

function getMedicamentosTexto(solicitud: Solicitud): string {
    return (solicitud.medicamento_solicitado ?? []).map((m) => m.nombre).join(", ");
}

const ITEMS_PER_PAGE = 15;

export function ListaSolicitudes() {
    const [allSolicitudes, setAllSolicitudes] = useState<Solicitud[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEstado, setFilterEstado] = useState<EstadoSolicitud | "all">("all");
    const [filterTipoSolicitud, setFilterTipoSolicitud] = useState("all");
    const [filterMedicamento, setFilterMedicamento] = useState("");
    const [filterCentroMedico, setFilterCentroMedico] = useState("");
    const [filterProvincia, setFilterProvincia] = useState("all");
    const [filterCiudad, setFilterCiudad] = useState("all");
    const [filterFechaDesde, setFilterFechaDesde] = useState("");
    const [filterFechaHasta, setFilterFechaHasta] = useState("");

    // Ubicacion data
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [ciudadMap, setCiudadMap] = useState<Map<string, Ciudad>>(new Map());

    // Paginacion local
    const [currentPage, setCurrentPage] = useState(1);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [solResult, provs, ciuades] = await Promise.all([
                solicitudService.getSolicitudes({ page: 1, limit: 500 }),
                ubicacionService.getProvincias().catch(() => []),
                ubicacionService.getCiudades().catch(() => []),
            ]);
            setAllSolicitudes(solResult.data);
            setProvincias(provs);
            setCiudades(ciuades);
            const map = new Map<string, Ciudad>();
            ciuades.forEach((c) => map.set(c.codigociudad, c));
            setCiudadMap(map);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar solicitudes");
            setAllSolicitudes([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Tipos de solicitud dinamicos extraidos de los datos
    const tiposSolicitud = useMemo(() => {
        const map = new Map<string, string>();
        allSolicitudes.forEach((s) => {
            if (s.tipo_solicitud) {
                map.set(s.tipo_solicitud.codigotiposolicitud, s.tipo_solicitud.descripcion);
            }
        });
        return Array.from(map.entries());
    }, [allSolicitudes]);

    // Ciudades filtradas por provincia seleccionada
    const ciudadesFiltradas = useMemo(() => {
        if (filterProvincia === "all") return ciudades;
        return ciudades.filter((c) => c.codigoprovincia === filterProvincia);
    }, [ciudades, filterProvincia]);

    // Helper: obtener codigoprovincia de una solicitud a traves de la persona del usuario
    const getProvinciaDeSolicitud = useCallback(
        (s: Solicitud): string | null => {
            const codigociudad = s.usuario?.persona?.codigociudad;
            if (!codigociudad) return null;
            const ciudad = ciudadMap.get(codigociudad);
            return ciudad?.codigoprovincia ?? null;
        },
        [ciudadMap]
    );

    // Contar filtros activos
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filterEstado !== "all") count++;
        if (filterTipoSolicitud !== "all") count++;
        if (filterMedicamento.trim()) count++;
        if (filterCentroMedico.trim()) count++;
        if (filterProvincia !== "all") count++;
        if (filterCiudad !== "all") count++;
        if (filterFechaDesde) count++;
        if (filterFechaHasta) count++;
        return count;
    }, [filterEstado, filterTipoSolicitud, filterMedicamento, filterCentroMedico, filterProvincia, filterCiudad, filterFechaDesde, filterFechaHasta]);

    const clearFilters = () => {
        setFilterEstado("all");
        setFilterTipoSolicitud("all");
        setFilterMedicamento("");
        setFilterCentroMedico("");
        setFilterProvincia("all");
        setFilterCiudad("all");
        setFilterFechaDesde("");
        setFilterFechaHasta("");
        setSearchTerm("");
        setCurrentPage(1);
    };

    // Filtrado completo
    const filtered = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();
        const medFilter = filterMedicamento.toLowerCase().trim();
        const centroFilter = filterCentroMedico.toLowerCase().trim();

        return allSolicitudes.filter((s) => {
            // Search global
            if (search) {
                const solicitante = getSolicitanteNombre(s).toLowerCase();
                const meds = getMedicamentosTexto(s).toLowerCase();
                const match =
                    s.numerosolicitud.toString().includes(search) ||
                    solicitante.includes(search) ||
                    s.patologia.toLowerCase().includes(search) ||
                    (s.centromedico ?? "").toLowerCase().includes(search) ||
                    meds.includes(search) ||
                    (s.cedularepresentante ?? "").includes(search) ||
                    (s.observaciones ?? "").toLowerCase().includes(search);
                if (!match) return false;
            }

            // Estado
            if (filterEstado !== "all" && s.estado !== filterEstado) return false;

            // Tipo solicitud
            if (filterTipoSolicitud !== "all" && s.codigotiposolicitud !== filterTipoSolicitud) return false;

            // Medicamento solicitado
            if (medFilter) {
                const hasMed = (s.medicamento_solicitado ?? []).some((m) =>
                    m.nombre.toLowerCase().includes(medFilter)
                );
                if (!hasMed) return false;
            }

            // Centro medico
            if (centroFilter) {
                if (!(s.centromedico ?? "").toLowerCase().includes(centroFilter)) return false;
            }

            // Provincia
            if (filterProvincia !== "all") {
                const prov = getProvinciaDeSolicitud(s);
                if (prov !== filterProvincia) return false;
            }

            // Ciudad
            if (filterCiudad !== "all") {
                const codigociudad = s.usuario?.persona?.codigociudad;
                if (codigociudad !== filterCiudad) return false;
            }

            // Fecha desde
            if (filterFechaDesde) {
                if (new Date(s.creada_en) < new Date(filterFechaDesde)) return false;
            }

            // Fecha hasta
            if (filterFechaHasta) {
                if (new Date(s.creada_en) > new Date(filterFechaHasta + "T23:59:59")) return false;
            }

            return true;
        });
    }, [allSolicitudes, searchTerm, filterEstado, filterTipoSolicitud, filterMedicamento, filterCentroMedico, filterProvincia, filterCiudad, filterFechaDesde, filterFechaHasta, getProvinciaDeSolicitud]);

    // Reset pagina cuando cambian filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterEstado, filterTipoSolicitud, filterMedicamento, filterCentroMedico, filterProvincia, filterCiudad, filterFechaDesde, filterFechaHasta]);

    // Paginacion local
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(start, start + ITEMS_PER_PAGE);
    }, [filtered, currentPage]);

    // Reset ciudad cuando cambia provincia
    useEffect(() => {
        setFilterCiudad("all");
    }, [filterProvincia]);

    const selectClass = "h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light";
    const inputClass = "h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light";
    const labelClass = "text-xs font-semibold uppercase tracking-wide text-[#8B9096]";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Solicitudes</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Gestiona y visualiza las solicitudes de medicamentos.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="flex h-10 items-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-4 text-sm font-medium text-danger transition hover:bg-danger/10"
                        >
                            <X className="h-4 w-4" />
                            Limpiar ({activeFilterCount})
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex h-10 items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-4 text-sm font-medium text-[#5B5B5B] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <Filter className="h-4 w-4" />
                        <span>Filtros</span>
                        {activeFilterCount > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-donamed-primary text-[10px] font-bold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
            )}

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <div className="flex items-center gap-3 text-sm text-[#5B5B5B]/80">
                            <span className="rounded-full bg-donamed-light px-3 py-1 text-xs font-semibold text-donamed-dark">
                                {filtered.length} de {allSolicitudes.length}
                            </span>
                            {filtered.length !== allSolicitudes.length && (
                                <span className="text-xs text-[#8B9096]">filtradas</span>
                            )}
                        </div>

                        <div className="group flex h-11 w-[380px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar N°, solicitante, patología, medicamento, centro, cédula..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                            />
                            {searchTerm && (
                                <button type="button" onClick={() => setSearchTerm("")} className="text-[#8B9096] hover:text-[#404040]">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Panel de filtros expandible */}
                    {showFilters && (
                        <div className="border-b border-[#EEF1F4] bg-white px-6 py-5">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {/* Estado */}
                                <div className="flex flex-col gap-2">
                                    <span className={labelClass}>Estado</span>
                                    <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value as EstadoSolicitud | "all")} className={selectClass}>
                                        <option value="all">Todos los estados</option>
                                        {(Object.keys(estadoLabels) as EstadoSolicitud[]).map((e) => (
                                            <option key={e} value={e}>{estadoLabels[e]}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tipo solicitud */}
                                <div className="flex flex-col gap-2">
                                    <span className={labelClass}>Tipo de solicitud</span>
                                    <select value={filterTipoSolicitud} onChange={(e) => setFilterTipoSolicitud(e.target.value)} className={selectClass}>
                                        <option value="all">Todos los tipos</option>
                                        {tiposSolicitud.map(([codigo, desc]) => (
                                            <option key={codigo} value={codigo}>{desc}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Medicamento solicitado */}
                                <div className="flex flex-col gap-2">
                                    <span className={labelClass}>Medicamento solicitado</span>
                                    <div className="relative">
                                        <Pill className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B9096]" />
                                        <input
                                            type="text"
                                            placeholder="Buscar medicamento..."
                                            value={filterMedicamento}
                                            onChange={(e) => setFilterMedicamento(e.target.value)}
                                            className={`${inputClass} pl-9`}
                                        />
                                    </div>
                                </div>

                                {/* Centro medico */}
                                <div className="flex flex-col gap-2">
                                    <span className={labelClass}>Centro médico</span>
                                    <input
                                        type="text"
                                        placeholder="Buscar centro..."
                                        value={filterCentroMedico}
                                        onChange={(e) => setFilterCentroMedico(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                {/* Provincia */}
                                <div className="flex flex-col gap-2">
                                    <span className={labelClass}>Provincia</span>
                                    <select value={filterProvincia} onChange={(e) => setFilterProvincia(e.target.value)} className={selectClass}>
                                        <option value="all">Todas las provincias</option>
                                        {provincias.map((p) => (
                                            <option key={p.codigoprovincia} value={p.codigoprovincia}>{p.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Ciudad */}
                                <div className="flex flex-col gap-2">
                                    <span className={labelClass}>Ciudad</span>
                                    <select value={filterCiudad} onChange={(e) => setFilterCiudad(e.target.value)} className={selectClass} disabled={filterProvincia === "all"}>
                                        <option value="all">{filterProvincia === "all" ? "Seleccione provincia primero" : "Todas las ciudades"}</option>
                                        {ciudadesFiltradas.map((c) => (
                                            <option key={c.codigociudad} value={c.codigociudad}>{c.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Fecha desde */}
                                <div className="flex flex-col gap-2">
                                    <span className={labelClass}>Fecha desde</span>
                                    <input
                                        type="date"
                                        value={filterFechaDesde}
                                        onChange={(e) => setFilterFechaDesde(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                {/* Fecha hasta */}
                                <div className="flex flex-col gap-2">
                                    <span className={labelClass}>Fecha hasta</span>
                                    <input
                                        type="date"
                                        value={filterFechaHasta}
                                        onChange={(e) => setFilterFechaHasta(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabla */}
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[900px]">
                            <div className="grid grid-cols-[0.5fr_1.3fr_1fr_1fr_1fr_0.8fr_0.7fr_0.6fr] gap-3 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                <span>N°</span>
                                <span>Solicitante / Centro</span>
                                <span>Patología</span>
                                <span>Medicamentos</span>
                                <span>Tipo</span>
                                <span>Fecha</span>
                                <span>Estado</span>
                                <span>Acciones</span>
                            </div>

                            {isLoading ? (
                                <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                    Cargando solicitudes...
                                </div>
                            ) : (
                                <>
                                    {paginatedData.map((solicitud) => (
                                        <div
                                            key={solicitud.numerosolicitud}
                                            className="grid grid-cols-[0.5fr_1.3fr_1fr_1fr_1fr_0.8fr_0.7fr_0.6fr] gap-3 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 shrink-0 rounded-full bg-donamed-primary" />
                                                <span className="font-medium">S-{solicitud.numerosolicitud}</span>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="truncate font-medium">{getSolicitanteNombre(solicitud)}</span>
                                                <span className="truncate text-xs text-[#5B5B5B]/70">{solicitud.centromedico || "—"}</span>
                                            </div>
                                            <span className="truncate" title={solicitud.patologia}>{solicitud.patologia}</span>
                                            <div className="flex flex-col min-w-0">
                                                {(solicitud.medicamento_solicitado ?? []).length > 0 ? (
                                                    <>
                                                        <span className="truncate text-xs font-medium">
                                                            {solicitud.medicamento_solicitado![0].nombre}
                                                        </span>
                                                        {solicitud.medicamento_solicitado!.length > 1 && (
                                                            <span className="text-[10px] text-[#8B9096]">
                                                                +{solicitud.medicamento_solicitado!.length - 1} más
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-[#8B9096]">Sin medicamentos</span>
                                                )}
                                            </div>
                                            <span className="truncate text-xs">
                                                {solicitud.tipo_solicitud?.descripcion ?? solicitud.codigotiposolicitud}
                                            </span>
                                            <span className="text-xs">{formatDate(solicitud.creada_en)}</span>
                                            <span className={`w-fit self-center rounded-full px-2.5 py-1 text-[10px] font-semibold leading-none ${statusStyles[solicitud.estado]}`}>
                                                {estadoLabels[solicitud.estado]}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/solicitudes/${solicitud.numerosolicitud}`}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                                    title="Ver detalle"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                {solicitud.estado === "APROBADA" && (
                                                    <Link
                                                        to={`/despachos/${solicitud.numerosolicitud}`}
                                                        className="inline-flex h-8 items-center justify-center rounded-lg bg-donamed-primary px-2 text-[10px] font-semibold text-white transition hover:bg-donamed-dark"
                                                    >
                                                        Despachar
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {filtered.length === 0 && (
                                        <div className="py-10 text-center">
                                            <p className="text-sm text-[#5B5B5B]/60">No se encontraron solicitudes</p>
                                            {activeFilterCount > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={clearFilters}
                                                    className="mt-2 text-sm font-medium text-donamed-primary hover:underline"
                                                >
                                                    Limpiar todos los filtros
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Paginacion */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-[#EEF1F4] px-6 py-4">
                            <span className="text-sm text-[#5B5B5B]/80">
                                Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage <= 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    className="h-9 rounded-xl"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Anterior
                                </Button>
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let page: number;
                                        if (totalPages <= 5) {
                                            page = i + 1;
                                        } else if (currentPage <= 3) {
                                            page = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            page = totalPages - 4 + i;
                                        } else {
                                            page = currentPage - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={page}
                                                type="button"
                                                onClick={() => setCurrentPage(page)}
                                                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                                                    page === currentPage
                                                        ? "bg-donamed-primary text-white"
                                                        : "border border-[#E7E7E7] text-[#5B5B5B] hover:bg-[#F9FBFC]"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    className="h-9 rounded-xl"
                                >
                                    Siguiente
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
