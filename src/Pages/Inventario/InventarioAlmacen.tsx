import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, X, Search } from "lucide-react";
import { almacenService, type Almacen } from "@/services/almacenService";
import { inventarioService, type InventarioItem } from "@/services/inventarioService";

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

export function InventarioAlmacen() {
    const navigate = useNavigate();
    const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
    const [items, setItems] = useState<InventarioItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAlmacen, setSelectedAlmacen] = useState("");
    const [search, setSearch] = useState("");
    const [filterEstado, setFilterEstado] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchAlmacenes = useCallback(async () => {
        try {
            const data = await almacenService.getAlmacenes();
            setAlmacenes(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar almacenes");
        }
    }, []);

    const fetchInventario = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = selectedAlmacen ? { almacen: parseInt(selectedAlmacen, 10) } : undefined;
            const data = await inventarioService.getInventario(params);
            setItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar inventario");
        } finally {
            setIsLoading(false);
        }
    }, [selectedAlmacen]);

    useEffect(() => {
        fetchAlmacenes();
    }, [fetchAlmacenes]);

    useEffect(() => {
        fetchInventario();
    }, [fetchInventario]);

    const filtered = useMemo(() => {
        return items.filter((item) => {
            const q = search.toLowerCase();
            const matchesSearch =
                !search.trim() ||
                (item.medicamento?.nombre ?? "").toLowerCase().includes(q) ||
                item.codigolote.toLowerCase().includes(q) ||
                item.codigomedicamento.toLowerCase().includes(q);

            const estado = getLoteEstado(item.lote?.fechavencimiento);
            const matchesEstado = !filterEstado || estado === filterEstado;

            return matchesSearch && matchesEstado;
        });
    }, [items, search, filterEstado]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(start, start + ITEMS_PER_PAGE);
    }, [filtered, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterEstado, selectedAlmacen]);

    const selectedAlmacenData = almacenes.find((a) => String(a.idalmacen) === selectedAlmacen);

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/inventario")}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a inventario
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">Inventario por almacén</h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Consulta el stock real por almacén, lote y estado de vencimiento.
                </p>
            </div>

            {error && (
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
            )}

            {/* Almacen info card */}
            {selectedAlmacenData && (
                <Card className="border-donamed-primary/20 bg-donamed-light/30">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-donamed-dark">
                            Almacén seleccionado
                        </p>
                        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <span className="text-xs text-[#8B9096]">Nombre</span>
                                <p className="text-sm font-medium text-[#2D3748]">{selectedAlmacenData.nombre}</p>
                            </div>
                            {selectedAlmacenData.telefono && (
                                <div>
                                    <span className="text-xs text-[#8B9096]">Teléfono</span>
                                    <p className="text-sm font-medium text-[#2D3748]">{selectedAlmacenData.telefono}</p>
                                </div>
                            )}
                            {selectedAlmacenData.correo && (
                                <div>
                                    <span className="text-xs text-[#8B9096]">Correo</span>
                                    <p className="text-sm font-medium text-[#2D3748]">{selectedAlmacenData.correo}</p>
                                </div>
                            )}
                            {selectedAlmacenData.ciudad && (
                                <div>
                                    <span className="text-xs text-[#8B9096]">Ciudad</span>
                                    <p className="text-sm font-medium text-[#2D3748]">
                                        {selectedAlmacenData.ciudad.nombre}
                                        {selectedAlmacenData.ciudad.provincia ? `, ${selectedAlmacenData.ciudad.provincia.nombre}` : ""}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    {/* Filters */}
                    <div className="border-b border-[#EEF1F4] bg-white px-6 py-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Almacén</span>
                                <select
                                    value={selectedAlmacen}
                                    onChange={(e) => setSelectedAlmacen(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Todos</option>
                                    {almacenes.map((a) => (
                                        <option key={a.idalmacen} value={a.idalmacen}>{a.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Buscar</span>
                                <div className="flex h-10 items-center gap-2 rounded-lg border border-[#E7E7E7] bg-white px-3 focus-within:ring-2 focus-within:ring-donamed-light">
                                    <Search className="h-4 w-4 text-[#8B9096]" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Medicamento, lote..."
                                        className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                                    />
                                    {search && (
                                        <button type="button" onClick={() => setSearch("")} className="text-[#8B9096] hover:text-[#404040]">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Estado lote</span>
                                <select
                                    value={filterEstado}
                                    onChange={(e) => setFilterEstado(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Todos</option>
                                    <option value="Vigente">Vigente</option>
                                    <option value="Proximo">Próximo a vencer</option>
                                    <option value="Vencido">Vencido</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[750px]">
                            <div className="grid grid-cols-[1fr_1.4fr_0.8fr_0.7fr_0.8fr_0.7fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                <span>Almacén</span>
                                <span>Medicamento</span>
                                <span>Lote</span>
                                <span>Cantidad</span>
                                <span>Vencimiento</span>
                                <span>Estado</span>
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
                                                className="grid grid-cols-[1fr_1.4fr_0.8fr_0.7fr_0.8fr_0.7fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                            >
                                                <span>{item.almacen?.nombre ?? `#${item.idalmacen}`}</span>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="truncate font-medium">{item.medicamento?.nombre ?? item.codigomedicamento}</span>
                                                    <span className="truncate text-xs text-[#8B9096]">{item.codigomedicamento}</span>
                                                </div>
                                                <span className="text-xs">{item.codigolote}</span>
                                                <span className="font-medium">{item.cantidad}</span>
                                                <span className="text-xs">{formatDate(item.lote?.fechavencimiento)}</span>
                                                <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${loteStyles[estado]}`}>
                                                    {estado}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {filtered.length === 0 && (
                                        <div className="py-16 text-center text-sm text-[#5B5B5B]/60">
                                            {selectedAlmacen ? "No hay inventario para este almacén" : "No se encontraron registros"}
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
