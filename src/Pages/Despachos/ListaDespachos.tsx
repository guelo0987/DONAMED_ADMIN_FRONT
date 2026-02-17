import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Truck, X, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { solicitudService } from "@/services/solicitudService";
import type { Solicitud } from "@/types/solicitud.types";

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-DO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function getSolicitanteNombre(s: Solicitud): string {
    const persona = s.usuario?.persona;
    if (persona) return `${persona.nombre} ${persona.apellidos}`;
    return s.usuario?.correo ?? "—";
}

function getMedicamentosTexto(s: Solicitud): string {
    const meds = s.medicamento_solicitado ?? [];
    return meds.map((m) => m.nombre).join(", ");
}

function getAlmacenesTexto(s: Solicitud): string {
    const detalles = s.detalle_solicitud ?? [];
    const nombres = [...new Set(detalles.map((d) => d.almacen?.nombre).filter(Boolean))];
    return nombres.join(", ");
}

const ITEMS_PER_PAGE = 15;

export function ListaDespachos() {
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterTipoSolicitud, setFilterTipoSolicitud] = useState("");
    const [filterCentroMedico, setFilterCentroMedico] = useState("");
    const [filterMedicamento, setFilterMedicamento] = useState("");
    const [filterAlmacen, setFilterAlmacen] = useState("");
    const [filterFechaDesde, setFilterFechaDesde] = useState("");
    const [filterFechaHasta, setFilterFechaHasta] = useState("");

    const fetchAprobadas = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await solicitudService.getSolicitudes({ page: 1, limit: 500, estado: "APROBADA" });
            setSolicitudes(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar solicitudes");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAprobadas();
    }, [fetchAprobadas]);

    const tiposSolicitud = useMemo(() => {
        const tipos = new Map<string, string>();
        solicitudes.forEach((s) => {
            const code = s.codigotiposolicitud;
            if (code && !tipos.has(code)) {
                tipos.set(code, s.tipo_solicitud?.descripcion ?? code);
            }
        });
        return Array.from(tipos.entries());
    }, [solicitudes]);

    const almacenesUnicos = useMemo(() => {
        const set = new Set<string>();
        solicitudes.forEach((s) => {
            (s.detalle_solicitud ?? []).forEach((d) => {
                if (d.almacen?.nombre) set.add(d.almacen.nombre);
            });
        });
        return Array.from(set).sort();
    }, [solicitudes]);

    const filtered = useMemo(() => {
        return solicitudes.filter((s) => {
            const val = searchTerm.toLowerCase();
            const solicitante = getSolicitanteNombre(s).toLowerCase();
            const medsTexto = getMedicamentosTexto(s).toLowerCase();
            const almacenTexto = getAlmacenesTexto(s).toLowerCase();

            const matchesSearch =
                !searchTerm.trim() ||
                s.numerosolicitud.toString().includes(val) ||
                solicitante.includes(val) ||
                s.patologia.toLowerCase().includes(val) ||
                (s.centromedico ?? "").toLowerCase().includes(val) ||
                medsTexto.includes(val) ||
                almacenTexto.includes(val);

            const matchesTipo = !filterTipoSolicitud || s.codigotiposolicitud === filterTipoSolicitud;

            const matchesCentro =
                !filterCentroMedico.trim() ||
                (s.centromedico ?? "").toLowerCase().includes(filterCentroMedico.toLowerCase());

            const matchesMedicamento =
                !filterMedicamento.trim() || medsTexto.includes(filterMedicamento.toLowerCase());

            const matchesAlmacen =
                !filterAlmacen ||
                (s.detalle_solicitud ?? []).some(
                    (d) => d.almacen?.nombre === filterAlmacen
                );

            let matchesFechaDesde = true;
            if (filterFechaDesde) {
                matchesFechaDesde = new Date(s.creada_en) >= new Date(filterFechaDesde);
            }

            let matchesFechaHasta = true;
            if (filterFechaHasta) {
                const hasta = new Date(filterFechaHasta);
                hasta.setHours(23, 59, 59, 999);
                matchesFechaHasta = new Date(s.creada_en) <= hasta;
            }

            return (
                matchesSearch &&
                matchesTipo &&
                matchesCentro &&
                matchesMedicamento &&
                matchesAlmacen &&
                matchesFechaDesde &&
                matchesFechaHasta
            );
        });
    }, [
        solicitudes,
        searchTerm,
        filterTipoSolicitud,
        filterCentroMedico,
        filterMedicamento,
        filterAlmacen,
        filterFechaDesde,
        filterFechaHasta,
    ]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(start, start + ITEMS_PER_PAGE);
    }, [filtered, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterTipoSolicitud, filterCentroMedico, filterMedicamento, filterAlmacen, filterFechaDesde, filterFechaHasta]);

    const clearFilters = () => {
        setSearchTerm("");
        setFilterTipoSolicitud("");
        setFilterCentroMedico("");
        setFilterMedicamento("");
        setFilterAlmacen("");
        setFilterFechaDesde("");
        setFilterFechaHasta("");
    };

    const activeFilters = [
        searchTerm,
        filterTipoSolicitud,
        filterCentroMedico,
        filterMedicamento,
        filterAlmacen,
        filterFechaDesde,
        filterFechaHasta,
    ].filter(Boolean).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Despachos</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Solicitudes aprobadas listas para despacho.
                    </p>
                </div>
                <Button asChild className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark">
                    <Link to="/despachos/historial">Historial de despachos</Link>
                </Button>
            </div>

            {error && (
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
            )}

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    {/* Header + Search */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <div className="flex items-center gap-3 text-sm text-[#5B5B5B]/80">
                            <span className="rounded-full bg-donamed-light px-3 py-1 text-xs font-semibold text-donamed-dark">
                                {filtered.length} solicitudes aprobadas
                            </span>
                            {activeFilters > 0 && (
                                <span className="flex items-center gap-1 text-xs text-donamed-primary">
                                    <Filter className="h-3.5 w-3.5" />
                                    {activeFilters} filtro{activeFilters > 1 ? "s" : ""} activo{activeFilters > 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                        <div className="group flex h-11 w-[340px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar N°, paciente, patología, centro, med..."
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

                    {/* Filters */}
                    <div className="border-b border-[#EEF1F4] bg-white px-6 py-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Tipo de solicitud
                                </span>
                                <select
                                    value={filterTipoSolicitud}
                                    onChange={(e) => setFilterTipoSolicitud(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Todos</option>
                                    {tiposSolicitud.map(([code, desc]) => (
                                        <option key={code} value={code}>{desc}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Almacén
                                </span>
                                <select
                                    value={filterAlmacen}
                                    onChange={(e) => setFilterAlmacen(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Todos</option>
                                    {almacenesUnicos.map((a) => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Centro médico
                                </span>
                                <input
                                    type="text"
                                    value={filterCentroMedico}
                                    onChange={(e) => setFilterCentroMedico(e.target.value)}
                                    placeholder="Filtrar por centro"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Medicamento
                                </span>
                                <input
                                    type="text"
                                    value={filterMedicamento}
                                    onChange={(e) => setFilterMedicamento(e.target.value)}
                                    placeholder="Filtrar por medicamento"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Fecha desde
                                </span>
                                <input
                                    type="date"
                                    value={filterFechaDesde}
                                    onChange={(e) => setFilterFechaDesde(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Fecha hasta
                                </span>
                                <input
                                    type="date"
                                    value={filterFechaHasta}
                                    onChange={(e) => setFilterFechaHasta(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            {activeFilters > 0 && (
                                <div className="flex items-end lg:col-span-2">
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#E7E7E7] bg-white px-4 text-sm text-[#5B5B5B] hover:bg-[#F7F7F7]"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        Limpiar filtros ({activeFilters})
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="w-full">
                        <div className="grid grid-cols-[0.5fr_1.2fr_1fr_0.9fr_0.9fr_0.7fr_0.7fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>N° Solicitud</span>
                            <span>Paciente / Centro</span>
                            <span>Patología</span>
                            <span>Tipo</span>
                            <span>Medicamentos</span>
                            <span>Fecha</span>
                            <span>Acciones</span>
                        </div>

                        {isLoading ? (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">Cargando solicitudes aprobadas...</div>
                        ) : (
                            <>
                                {paginated.map((s) => {
                                    const meds = s.medicamento_solicitado ?? [];
                                    const firstMed = meds[0]?.nombre ?? "—";
                                    const medCount = meds.length;

                                    return (
                                        <div
                                            key={s.numerosolicitud}
                                            className="grid grid-cols-[0.5fr_1.2fr_1fr_0.9fr_0.9fr_0.7fr_0.7fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                        >
                                            <span className="font-medium">S-{s.numerosolicitud}</span>
                                            <div className="flex flex-col min-w-0">
                                                <span className="truncate font-medium">{getSolicitanteNombre(s)}</span>
                                                <span className="truncate text-xs text-[#5B5B5B]/70">{s.centromedico || "—"}</span>
                                            </div>
                                            <span className="truncate">{s.patologia}</span>
                                            <span className="truncate text-xs">
                                                {s.tipo_solicitud?.descripcion ?? s.codigotiposolicitud}
                                            </span>
                                            <div className="flex flex-col min-w-0">
                                                <span className="truncate text-xs">{firstMed}</span>
                                                {medCount > 1 && (
                                                    <span className="text-xs text-[#8B9096]">+{medCount - 1} más</span>
                                                )}
                                            </div>
                                            <span className="text-xs">{formatDate(s.creada_en)}</span>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/despachos/${s.numerosolicitud}`}
                                                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-donamed-primary px-3 text-xs font-semibold text-white transition hover:bg-donamed-dark"
                                                >
                                                    <Truck className="h-3.5 w-3.5" />
                                                    Despachar
                                                </Link>
                                                <Link
                                                    to={`/solicitudes/${s.numerosolicitud}`}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                                    title="Ver solicitud"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}

                                {filtered.length === 0 && (
                                    <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                        No hay solicitudes aprobadas pendientes de despacho
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-[#EEF1F4] bg-[#FBFBFC] px-6 py-4">
                            <span className="text-xs text-[#8B9096]">
                                Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 rounded-lg text-xs"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    Anterior
                                </Button>
                                <span className="text-xs text-[#5B5B5B]">
                                    {currentPage} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 rounded-lg text-xs"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
