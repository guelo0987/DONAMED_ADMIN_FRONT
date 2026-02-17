import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, ArrowLeft, Loader2, Trash2, Eye, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import { despachoService, type Despacho } from "@/services/despachoService";

function formatDateTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-DO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getSolicitanteNombre(despacho: Despacho): string {
    const sol = despacho.solicitud_despacho_solicitudTosolicitud;
    const persona = sol?.usuario?.persona;
    if (persona) return `${persona.nombre} ${persona.apellidos}`;
    return sol?.usuario?.correo ?? "—";
}

function getReceptorNombre(despacho: Despacho): string {
    const persona = despacho.persona;
    if (persona) return `${persona.nombre} ${persona.apellidos}`;
    return despacho.cedula_recibe ?? "—";
}

function getCentroMedico(despacho: Despacho): string {
    return despacho.solicitud_despacho_solicitudTosolicitud?.centromedico ?? "";
}

function getMedicamentosTexto(despacho: Despacho): string {
    const detalles = despacho.solicitud_despacho_solicitudTosolicitud?.detalle_solicitud ?? [];
    return detalles.map((d) => d.lote?.medicamento?.nombre ?? "").filter(Boolean).join(", ");
}

function getAlmacenesTexto(despacho: Despacho): string {
    const detalles = despacho.solicitud_despacho_solicitudTosolicitud?.detalle_solicitud ?? [];
    const nombres = [...new Set(detalles.map((d) => d.almacen?.nombre).filter(Boolean))];
    return nombres.join(", ");
}

const ITEMS_PER_PAGE = 15;

export function HistorialDespachos() {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [allDespachos, setAllDespachos] = useState<Despacho[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterAlmacen, setFilterAlmacen] = useState("");
    const [filterTipoSolicitud, setFilterTipoSolicitud] = useState("");
    const [filterCentroMedico, setFilterCentroMedico] = useState("");
    const [filterMedicamento, setFilterMedicamento] = useState("");
    const [filterFechaDesde, setFilterFechaDesde] = useState("");
    const [filterFechaHasta, setFilterFechaHasta] = useState("");

    const [selected, setSelected] = useState<Despacho | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchDespachos = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await despachoService.getDespachos({ page: 1, limit: 500 });
            setAllDespachos(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar despachos");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDespachos();
    }, [fetchDespachos]);

    const almacenesUnicos = useMemo(() => {
        const set = new Set<string>();
        allDespachos.forEach((d) => {
            (d.solicitud_despacho_solicitudTosolicitud?.detalle_solicitud ?? []).forEach((det) => {
                if (det.almacen?.nombre) set.add(det.almacen.nombre);
            });
        });
        return Array.from(set).sort();
    }, [allDespachos]);

    const tiposSolicitud = useMemo(() => {
        const tipos = new Map<string, string>();
        allDespachos.forEach((d) => {
            const sol = d.solicitud_despacho_solicitudTosolicitud;
            if (sol) {
                const code = sol.codigotiposolicitud;
                if (code && !tipos.has(code)) {
                    tipos.set(code, sol.tipo_solicitud?.descripcion ?? code);
                }
            }
        });
        return Array.from(tipos.entries());
    }, [allDespachos]);

    const filtered = useMemo(() => {
        return allDespachos.filter((d) => {
            const val = searchTerm.toLowerCase();
            const solicitante = getSolicitanteNombre(d).toLowerCase();
            const receptor = getReceptorNombre(d).toLowerCase();
            const centro = getCentroMedico(d).toLowerCase();
            const medsTexto = getMedicamentosTexto(d).toLowerCase();
            const almacenTexto = getAlmacenesTexto(d).toLowerCase();

            const matchesSearch =
                !searchTerm.trim() ||
                d.numerodespacho.toString().includes(val) ||
                d.solicitud.toString().includes(val) ||
                solicitante.includes(val) ||
                receptor.includes(val) ||
                (d.cedula_recibe ?? "").includes(val) ||
                centro.includes(val) ||
                medsTexto.includes(val) ||
                almacenTexto.includes(val);

            const matchesAlmacen =
                !filterAlmacen ||
                (d.solicitud_despacho_solicitudTosolicitud?.detalle_solicitud ?? []).some(
                    (det) => det.almacen?.nombre === filterAlmacen
                );

            const matchesTipo =
                !filterTipoSolicitud ||
                d.solicitud_despacho_solicitudTosolicitud?.codigotiposolicitud === filterTipoSolicitud;

            const matchesCentro =
                !filterCentroMedico.trim() ||
                centro.includes(filterCentroMedico.toLowerCase());

            const matchesMedicamento =
                !filterMedicamento.trim() || medsTexto.includes(filterMedicamento.toLowerCase());

            let matchesFechaDesde = true;
            if (filterFechaDesde) {
                matchesFechaDesde = new Date(d.fecha_despacho) >= new Date(filterFechaDesde);
            }

            let matchesFechaHasta = true;
            if (filterFechaHasta) {
                const hasta = new Date(filterFechaHasta);
                hasta.setHours(23, 59, 59, 999);
                matchesFechaHasta = new Date(d.fecha_despacho) <= hasta;
            }

            return (
                matchesSearch &&
                matchesAlmacen &&
                matchesTipo &&
                matchesCentro &&
                matchesMedicamento &&
                matchesFechaDesde &&
                matchesFechaHasta
            );
        });
    }, [
        allDespachos,
        searchTerm,
        filterAlmacen,
        filterTipoSolicitud,
        filterCentroMedico,
        filterMedicamento,
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
    }, [searchTerm, filterAlmacen, filterTipoSolicitud, filterCentroMedico, filterMedicamento, filterFechaDesde, filterFechaHasta]);

    const handleDelete = async () => {
        if (!selected) return;
        setIsDeleting(true);
        try {
            await despachoService.deleteDespacho(selected.numerodespacho);
            addToast({ variant: "success", title: "Despacho revertido", message: "El despacho fue eliminado y la solicitud fue revertida a APROBADA." });
            setAllDespachos((prev) => prev.filter((d) => d.numerodespacho !== selected.numerodespacho));
            setSelected(null);
        } catch (err) {
            addToast({ variant: "error", title: "Error", message: err instanceof Error ? err.message : "Error al eliminar despacho" });
        } finally {
            setIsDeleting(false);
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setFilterAlmacen("");
        setFilterTipoSolicitud("");
        setFilterCentroMedico("");
        setFilterMedicamento("");
        setFilterFechaDesde("");
        setFilterFechaHasta("");
    };

    const activeFilters = [
        searchTerm,
        filterAlmacen,
        filterTipoSolicitud,
        filterCentroMedico,
        filterMedicamento,
        filterFechaDesde,
        filterFechaHasta,
    ].filter(Boolean).length;

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/despachos")}
                    className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver a despachos
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Historial de Despachos
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Registro de todos los despachos realizados.
                </p>
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
                                {filtered.length} despachos
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
                                placeholder="Buscar N°, solicitud, receptor, centro, med..."
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
                        <div className="grid grid-cols-[0.4fr_0.5fr_1fr_1fr_0.8fr_0.8fr_0.7fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>N° Despacho</span>
                            <span>N° Solicitud</span>
                            <span>Solicitante</span>
                            <span>Receptor</span>
                            <span>Centro / Almacén</span>
                            <span>Fecha despacho</span>
                            <span>Acciones</span>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="h-6 w-6 animate-spin text-donamed-primary" />
                            </div>
                        ) : (
                            <>
                                {paginated.map((d) => {
                                    const centro = getCentroMedico(d);
                                    const almacenes = getAlmacenesTexto(d);

                                    return (
                                        <div
                                            key={d.numerodespacho}
                                            className="grid grid-cols-[0.4fr_0.5fr_1fr_1fr_0.8fr_0.8fr_0.7fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                        >
                                            <span className="font-medium">D-{d.numerodespacho}</span>
                                            <span className="text-xs">S-{d.solicitud}</span>
                                            <span className="truncate">{getSolicitanteNombre(d)}</span>
                                            <div className="flex flex-col min-w-0">
                                                <span className="truncate">{getReceptorNombre(d)}</span>
                                                <span className="truncate text-xs text-[#5B5B5B]/70">{d.cedula_recibe}</span>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="truncate text-xs">{centro || "—"}</span>
                                                {almacenes && (
                                                    <span className="truncate text-xs text-[#8B9096]">{almacenes}</span>
                                                )}
                                            </div>
                                            <span className="text-xs">{formatDateTime(d.fecha_despacho)}</span>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="h-9 rounded-xl"
                                                    size="sm"
                                                >
                                                    <Link to={`/despachos/historial/${d.numerodespacho}`}>
                                                        <Eye className="mr-1 h-3.5 w-3.5" />
                                                        Ver
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    className="h-9 rounded-xl bg-danger/90 text-white hover:bg-danger"
                                                    onClick={() => setSelected(d)}
                                                >
                                                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                                                    Revertir
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {filtered.length === 0 && (
                                    <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                        No se encontraron despachos
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

            {/* Delete/Revert Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-[0px_30px_80px_-40px_rgba(0,0,0,0.6)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Reversar despacho
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-[#1E1E1E]">
                                    D-{selected.numerodespacho} · S-{selected.solicitud}
                                </h3>
                                <p className="mt-2 text-sm text-[#5B5B5B]/80">
                                    Esta acción eliminará el despacho y revertirá la solicitud al estado <strong>APROBADA</strong>.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="rounded-lg border border-[#E7E7E7] px-3 py-1 text-sm text-[#5B5B5B] hover:bg-[#F7F7F7]"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="mt-5 rounded-lg bg-danger/5 border border-danger/20 p-4 text-sm text-danger">
                            <strong>Advertencia:</strong> Esta acción no se puede deshacer. El despacho será eliminado permanentemente.
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 rounded-xl"
                                onClick={() => setSelected(null)}
                                disabled={isDeleting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                className="h-10 rounded-xl bg-danger text-white hover:bg-danger/90"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                {isDeleting ? "Eliminando..." : "Confirmar reverso"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
