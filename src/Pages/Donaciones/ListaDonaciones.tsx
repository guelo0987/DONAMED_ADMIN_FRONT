import { useCallback, useEffect, useState } from "react";
import { Search, Eye, Plus, PencilLine, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { donacionService } from "@/services/donacionService";
import type { Donacion } from "@/services/donacionService";

function formatDate(dateStr: string): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function ListaDonaciones() {
    const [donaciones, setDonaciones] = useState<Donacion[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [eliminarTarget, setEliminarTarget] = useState<Donacion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });

    const fetchDonaciones = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await donacionService.getDonaciones({
                page,
                limit: 20,
                proveedor: searchQuery || undefined,
            });
            setDonaciones(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar donaciones");
            setDonaciones([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchDonaciones(1);
    }, [fetchDonaciones]);

    const handleSearch = () => {
        setSearchQuery(searchTerm);
    };

    const handleEliminar = async () => {
        if (!eliminarTarget) return;
        try {
            await donacionService.deleteDonacion(eliminarTarget.numerodonacion);
            setDonaciones((prev) =>
                prev.filter((d) => d.numerodonacion !== eliminarTarget.numerodonacion)
            );
            setEliminarTarget(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al eliminar");
        }
    };

    const totalMedicamentos = (d: Donacion) =>
        d.donacion_medicamento?.reduce((sum, m) => sum + m.cantidad, 0) ?? 0;
    const proveedorNombre = (d: Donacion) =>
        d.proveedor_donaciones_proveedorToproveedor?.nombre ?? d.proveedor ?? "—";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Donaciones</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Control de donaciones de medicamentos e inventario.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-11 gap-2 rounded-xl bg-donamed-primary px-5 text-sm font-semibold hover:bg-donamed-dark"
                >
                    <Link to="/donaciones/nueva">
                        <Plus className="h-4 w-4" />
                        Nueva Donación
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
                                {pagination.total} donaciones
                            </span>
                            <span>Registradas</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="group flex h-11 w-[260px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                                <Search className="h-4 w-4 text-[#5B5B5B]" />
                                <input
                                    type="text"
                                    placeholder="Buscar por proveedor"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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

                    <div className="w-full">
                        <div className="grid grid-cols-[0.8fr_1.4fr_1fr_1fr_1.2fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>#</span>
                            <span>Proveedor</span>
                            <span>Fecha</span>
                            <span>Total unidades</span>
                            <span>Acciones</span>
                        </div>

                        {isLoading ? (
                            <div className="py-16 text-center">
                                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-donamed-light border-t-donamed-primary" />
                                <p className="mt-3 text-sm text-[#5B5B5B]">Cargando donaciones...</p>
                            </div>
                        ) : (
                            <>
                                {donaciones.map((donacion) => (
                                    <div
                                        key={donacion.numerodonacion}
                                        className="grid grid-cols-[0.8fr_1.4fr_1fr_1fr_1.2fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                    >
                                        <span className="font-medium">
                                            {donacion.numerodonacion}
                                        </span>
                                        <span>{proveedorNombre(donacion)}</span>
                                        <span>{formatDate(donacion.fecha_recibida)}</span>
                                        <span>{totalMedicamentos(donacion)}</span>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/donaciones/${donacion.numerodonacion}`}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                                title="Ver detalle"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                to={`/donaciones/${donacion.numerodonacion}/editar`}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                                title="Editar"
                                            >
                                                <PencilLine className="h-4 w-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => setEliminarTarget(donacion)}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-danger transition hover:border-danger/40 hover:bg-danger/5"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {donaciones.length === 0 && (
                                    <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                        No se encontraron donaciones
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
                                    Eliminar donación
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-[#1E1E1E]">
                                    #{eliminarTarget.numerodonacion} · {proveedorNombre(eliminarTarget)}
                                </h3>
                                <p className="mt-2 text-sm text-[#5B5B5B]/80">
                                    Se revertirá el inventario. ¿Estás seguro?
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
