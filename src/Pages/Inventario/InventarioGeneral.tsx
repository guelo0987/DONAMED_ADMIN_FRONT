import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Warehouse, ArrowUpRight, X, Filter, Loader2, Package, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { inventarioService, type InventarioItem } from "@/services/inventarioService";
import { almacenService, type Almacen } from "@/services/almacenService";

type LoteEstado = "Vigente" | "Proximo" | "Vencido";

function getLoteEstado(fechaVencimiento?: string): LoteEstado {
    if (!fechaVencimiento) return "Vigente";
    const now = new Date();
    const venc = new Date(fechaVencimiento);
    if (venc < now) return "Vencido";
    const diff = venc.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days <= 90) return "Proximo";
    return "Vigente";
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-DO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const loteStyles: Record<LoteEstado, string> = {
    Vigente: "bg-success-light text-success",
    Proximo: "bg-warning-light text-warning",
    Vencido: "bg-danger-light text-danger",
};

const ITEMS_PER_PAGE = 20;

export function InventarioGeneral() {
    const [items, setItems] = useState<InventarioItem[]>([]);
    const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [search, setSearch] = useState("");
    const [filterAlmacen, setFilterAlmacen] = useState("");
    const [filterEstadoLote, setFilterEstadoLote] = useState("");

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [inv, alms] = await Promise.all([
                inventarioService.getInventario(),
                almacenService.getAlmacenes(),
            ]);
            setItems(inv);
            setAlmacenes(alms);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar inventario");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filtered = useMemo(() => {
        return items.filter((item) => {
            const medName = (item.medicamento?.nombre ?? "").toLowerCase();
            const almName = (item.almacen?.nombre ?? "").toLowerCase();
            const loteCode = item.codigolote.toLowerCase();
            const q = search.toLowerCase();

            const matchesSearch =
                !search.trim() ||
                medName.includes(q) ||
                almName.includes(q) ||
                loteCode.includes(q) ||
                item.codigomedicamento.toLowerCase().includes(q);

            const matchesAlmacen =
                !filterAlmacen || item.idalmacen === parseInt(filterAlmacen, 10);

            const estado = getLoteEstado(item.lote?.fechavencimiento);
            const matchesEstado = !filterEstadoLote || estado === filterEstadoLote;

            return matchesSearch && matchesAlmacen && matchesEstado;
        });
    }, [items, search, filterAlmacen, filterEstadoLote]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(start, start + ITEMS_PER_PAGE);
    }, [filtered, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterAlmacen, filterEstadoLote]);

    const clearFilters = () => {
        setSearch("");
        setFilterAlmacen("");
        setFilterEstadoLote("");
    };

    const activeFilters = [search, filterAlmacen, filterEstadoLote].filter(Boolean).length;

    // Stats
    const totalUnidades = useMemo(() => items.reduce((a, i) => a + i.cantidad, 0), [items]);
    const stockBajo = useMemo(() => items.filter((i) => i.cantidad > 0 && i.cantidad <= 10).length, [items]);
    const proximosVencer = useMemo(
        () => items.filter((i) => getLoteEstado(i.lote?.fechavencimiento) === "Proximo").length,
        [items]
    );
    const vencidos = useMemo(
        () => items.filter((i) => getLoteEstado(i.lote?.fechavencimiento) === "Vencido").length,
        [items]
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Inventario</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Stock real por almacén, lote y medicamento.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" className="h-10 rounded-xl border-[#E7E7E7]">
                        <Link to="/inventario/almacen">
                            <Warehouse className="h-4 w-4" />
                            Ver por almacén
                        </Link>
                    </Button>
                    <Button asChild className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark">
                        <Link to="/inventario/movimientos">
                            Ajustar inventario
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {error && (
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
            )}

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-donamed-light">
                                <Package className="h-5 w-5 text-donamed-dark" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Registros</p>
                                <p className="text-2xl font-semibold text-[#1E1E1E]">{items.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Total unidades</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">{totalUnidades.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-light">
                                <AlertTriangle className="h-5 w-5 text-warning" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Próximos a vencer</p>
                                <p className="text-2xl font-semibold text-[#1E1E1E]">{proximosVencer}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Vencidos / Stock bajo</p>
                                <p className="mt-2 text-2xl font-semibold text-danger">{vencidos}</p>
                            </div>
                            <span className="rounded-full bg-warning-light px-2 py-0.5 text-xs font-semibold text-warning">
                                {stockBajo} bajo
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    {/* Header + Search */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <div className="flex items-center gap-3 text-sm text-[#5B5B5B]/80">
                            <span className="rounded-full bg-donamed-light px-3 py-1 text-xs font-semibold text-donamed-dark">
                                {filtered.length} registros
                            </span>
                            {activeFilters > 0 && (
                                <span className="flex items-center gap-1 text-xs text-donamed-primary">
                                    <Filter className="h-3.5 w-3.5" />
                                    {activeFilters} filtro{activeFilters > 1 ? "s" : ""} activo{activeFilters > 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                        <div className="group flex h-11 w-[320px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar medicamento, lote, almacén..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                            />
                            {search && (
                                <button type="button" onClick={() => setSearch("")} className="text-[#8B9096] hover:text-[#404040]">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="border-b border-[#EEF1F4] bg-white px-6 py-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Almacén</span>
                                <select
                                    value={filterAlmacen}
                                    onChange={(e) => setFilterAlmacen(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Todos</option>
                                    {almacenes.map((a) => (
                                        <option key={a.idalmacen} value={a.idalmacen}>{a.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Estado del lote</span>
                                <select
                                    value={filterEstadoLote}
                                    onChange={(e) => setFilterEstadoLote(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Todos</option>
                                    <option value="Vigente">Vigente</option>
                                    <option value="Proximo">Próximo a vencer</option>
                                    <option value="Vencido">Vencido</option>
                                </select>
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

                    {/* Data */}
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[800px]">
                            <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.8fr_0.7fr_0.6fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                <span>Medicamento</span>
                                <span>Lote</span>
                                <span>Almacén</span>
                                <span>Cantidad</span>
                                <span>Vencimiento</span>
                                <span>Estado</span>
                                <span>Acciones</span>
                            </div>

                            {isLoading ? (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 className="h-6 w-6 animate-spin text-donamed-primary" />
                                </div>
                            ) : (
                                <>
                                    {paginated.map((item) => {
                                        const estado = getLoteEstado(item.lote?.fechavencimiento);
                                        return (
                                            <div
                                                key={`${item.idalmacen}-${item.codigolote}-${item.codigomedicamento}`}
                                                className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.8fr_0.7fr_0.6fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                            >
                                                <div className="flex flex-col min-w-0">
                                                    <span className="truncate font-medium">{item.medicamento?.nombre ?? item.codigomedicamento}</span>
                                                    <span className="truncate text-xs text-[#8B9096]">{item.codigomedicamento}</span>
                                                </div>
                                                <span className="truncate text-xs">{item.codigolote}</span>
                                                <span className="truncate">{item.almacen?.nombre ?? `#${item.idalmacen}`}</span>
                                                <span className="font-medium">{item.cantidad}</span>
                                                <span className="text-xs">{formatDate(item.lote?.fechavencimiento)}</span>
                                                <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${loteStyles[estado]}`}>
                                                    {estado}
                                                </span>
                                                <Link
                                                    to={`/inventario/medicamento/${encodeURIComponent(item.codigomedicamento)}`}
                                                    className="inline-flex h-8 items-center justify-center rounded-lg bg-donamed-primary px-3 text-xs font-semibold text-white transition hover:bg-donamed-dark"
                                                >
                                                    Detalle
                                                </Link>
                                            </div>
                                        );
                                    })}
                                    {filtered.length === 0 && !isLoading && (
                                        <div className="py-16 text-center text-sm text-[#5B5B5B]/60">
                                            No se encontraron registros de inventario
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-[#EEF1F4] bg-[#FBFBFC] px-6 py-4">
                            <span className="text-xs text-[#8B9096]">
                                Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
                            </span>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                                    Anterior
                                </Button>
                                <span className="text-xs text-[#5B5B5B]">{currentPage} / {totalPages}</span>
                                <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
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
