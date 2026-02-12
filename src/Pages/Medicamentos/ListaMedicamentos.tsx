import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Eye, ChevronDown, Plus, PencilLine, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { medicamentoService } from "@/services/medicamentoService";
import type { Medicamento } from "@/services/medicamentoService";

type EstadoMedicamento = "ACTIVO" | "INACTIVO";

const statusStyles: Record<EstadoMedicamento, string> = {
    ACTIVO: "bg-success-light text-success",
    INACTIVO: "bg-warning-light text-warning",
};

const estadoLabels: Record<EstadoMedicamento, string> = {
    ACTIVO: "Activo",
    INACTIVO: "Inactivo",
};

export function ListaMedicamentos() {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [estado, setEstado] = useState<EstadoMedicamento | "all">("all");
    const [mostrarSoloBajoStock, setMostrarSoloBajoStock] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [eliminarTarget, setEliminarTarget] = useState<Medicamento | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
    });

    const fetchMedicamentos = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await medicamentoService.getMedicamentos({
                page,
                limit: 50,
                search: searchQuery || undefined,
            });
            setMedicamentos(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar medicamentos");
            setMedicamentos([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchMedicamentos(1);
    }, [fetchMedicamentos]);

    const handleSearch = () => {
        setSearchQuery(searchTerm);
    };

    const handleEliminar = async () => {
        if (!eliminarTarget) return;
        try {
            await medicamentoService.deleteMedicamento(eliminarTarget.codigomedicamento);
            setMedicamentos((prev) =>
                prev.filter((m) => m.codigomedicamento !== eliminarTarget.codigomedicamento)
            );
            setEliminarTarget(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al eliminar");
        }
    };

    const filteredMedicamentos = useMemo(() => {
        return medicamentos.filter((m) => {
            const matchesEstado =
                estado === "all" ||
                (m.estado === estado || (estado === "ACTIVO" && !m.estado));
            const stock = m.cantidad_disponible_global ?? 0;
            const matchesBajoStock = !mostrarSoloBajoStock || stock < 100;
            return matchesEstado && matchesBajoStock;
        });
    }, [medicamentos, estado, mostrarSoloBajoStock]);

    const formaNombre = (m: Medicamento) => m.forma_farmaceutica?.nombre ?? "—";
    const viaNombre = (m: Medicamento) => m.via_administracion?.nombre ?? "—";
    const estadoDisplay = (m: Medicamento) =>
        (m.estado as EstadoMedicamento) || "ACTIVO";
    const stockDisplay = (m: Medicamento) =>
        m.cantidad_disponible_global ?? "—";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                        Medicamentos
                    </h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Catálogo de medicamentos según forma farmacéutica y vía de
                        administración.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-10 gap-2 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                >
                    <Link to="/medicamentos/nuevo">
                        <Plus className="h-4 w-4" />
                        Nuevo medicamento
                    </Link>
                </Button>
            </div>

            {error && (
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error}
                </div>
            )}

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <div className="flex items-center gap-3 text-sm text-[#5B5B5B]/80">
                            <span className="rounded-full bg-donamed-light px-3 py-1 text-xs font-semibold text-donamed-dark">
                                {filteredMedicamentos.length} resultados
                            </span>
                            <span>Catálogo actualizado</span>
                        </div>

                        <div className="flex items-center gap-3">
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
                            <div className="flex items-center gap-2">
                                <div className="group flex h-11 w-[280px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                                        <Search className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Buscar por código, nombre, compuesto..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && handleSearch()
                                        }
                                        className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleSearch}
                                    className="h-11 rounded-xl bg-donamed-primary px-4 text-white hover:bg-donamed-dark"
                                >
                                    Buscar
                                </Button>
                            </div>
                        </div>
                    </div>

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
                                            setEstado(
                                                e.target
                                                    .value as EstadoMedicamento | "all"
                                            )
                                        }
                                        className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    >
                                        <option value="all">Todos</option>
                                        {(Object.keys(
                                            estadoLabels
                                        ) as EstadoMedicamento[]).map((e) => (
                                            <option key={e} value={e}>
                                                {estadoLabels[e]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <input
                                        type="checkbox"
                                        id="bajoStock"
                                        checked={mostrarSoloBajoStock}
                                        onChange={(e) =>
                                            setMostrarSoloBajoStock(
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 rounded border-[#E7E7E7]"
                                    />
                                    <label
                                        htmlFor="bajoStock"
                                        className="text-sm text-[#404040]"
                                    >
                                        Solo stock bajo (&lt;100 unidades)
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="w-full">
                        <div className="grid grid-cols-[0.9fr_1.5fr_1.2fr_0.9fr_0.9fr_0.8fr_0.9fr_0.9fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Código</span>
                            <span>Nombre</span>
                            <span>Compuesto principal</span>
                            <span>Forma</span>
                            <span>Vía</span>
                            <span>Stock</span>
                            <span>Estado</span>
                            <span>Acciones</span>
                        </div>

                        {isLoading ? (
                            <div className="py-16 text-center">
                                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-donamed-light border-t-donamed-primary" />
                                <p className="mt-3 text-sm text-[#5B5B5B]">
                                    Cargando medicamentos...
                                </p>
                            </div>
                        ) : (
                            <>
                                {filteredMedicamentos.map((med) => (
                                    <div
                                        key={med.codigomedicamento}
                                        className="grid grid-cols-[0.9fr_1.5fr_1.2fr_0.9fr_0.9fr_0.8fr_0.9fr_0.9fr] gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                    >
                                        <span className="font-medium">
                                            {med.codigomedicamento}
                                        </span>
                                        <span className="font-medium">
                                            {med.nombre}
                                        </span>
                                        <span
                                            className="truncate"
                                            title={
                                                med.compuesto_principal ?? ""
                                            }
                                        >
                                            {med.compuesto_principal ?? "—"}
                                        </span>
                                        <span>{formaNombre(med)}</span>
                                        <span>{viaNombre(med)}</span>
                                        <span
                                            className={
                                                typeof stockDisplay(med) ===
                                                    "number" &&
                                                (stockDisplay(med) as number) < 100
                                                    ? "font-semibold text-warning"
                                                    : ""
                                            }
                                        >
                                            {stockDisplay(med)}
                                        </span>
                                        <span
                                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[estadoDisplay(med)]}`}
                                        >
                                            {estadoLabels[estadoDisplay(med)]}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/medicamentos/${encodeURIComponent(med.codigomedicamento)}`}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                                title="Ver detalle"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                to={`/medicamentos/${encodeURIComponent(med.codigomedicamento)}/editar`}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                                title="Editar"
                                            >
                                                <PencilLine className="h-4 w-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEliminarTarget(med)
                                                }
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-danger transition hover:border-danger/40 hover:bg-danger/5"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <Link
                                                to={`/inventario/medicamento/${encodeURIComponent(med.codigomedicamento)}`}
                                                className="inline-flex h-9 items-center justify-center rounded-xl border-2 border-donamed-primary bg-white px-3 text-xs font-semibold text-donamed-primary transition hover:bg-[#F7F7F7]"
                                            >
                                                Inventario
                                            </Link>
                                        </div>
                                    </div>
                                ))}

                                {filteredMedicamentos.length === 0 && (
                                    <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                        No se encontraron medicamentos
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {eliminarTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-[0px_30px_80px_-40px_rgba(0,0,0,0.6)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Eliminar medicamento
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-[#1E1E1E]">
                                    {eliminarTarget.codigomedicamento} ·{" "}
                                    {eliminarTarget.nombre}
                                </h3>
                                <p className="mt-2 text-sm text-[#5B5B5B]/80">
                                    ¿Estás seguro? Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEliminarTarget(null)}
                                className="rounded-lg border border-[#E7E7E7] px-3 py-1 text-sm text-[#5B5B5B] hover:bg-[#F7F7F7]"
                            >
                                Cerrar
                            </button>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 rounded-xl"
                                onClick={() => setEliminarTarget(null)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                className="h-11 rounded-xl bg-danger text-white hover:bg-danger/90"
                                onClick={handleEliminar}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
