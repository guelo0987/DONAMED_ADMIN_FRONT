import { useCallback, useEffect, useState } from "react";
import { Search, Eye, Plus, PencilLine, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { proveedorService } from "@/services/proveedorService";
import { useToast } from "@/contexts/ToastContext";
import type { Proveedor } from "@/types/proveedor.types";

export function ListaProveedores() {
    const { addToast } = useToast();
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [eliminarTarget, setEliminarTarget] = useState<Proveedor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
    });

    const fetchProveedores = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await proveedorService.getProveedores({
                page,
                limit: 20,
                search: searchQuery || undefined,
            });
            setProveedores(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar proveedores");
            setProveedores([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchProveedores(1);
    }, [fetchProveedores]);

    const handleSearch = () => {
        setSearchQuery(searchTerm);
    };

    const handleEliminar = async () => {
        if (!eliminarTarget) return;
        const nombre = eliminarTarget.nombre;
        try {
            await proveedorService.deleteProveedor(eliminarTarget.rncproveedor);
            setProveedores((prev) =>
                prev.filter((p) => p.rncproveedor !== eliminarTarget.rncproveedor)
            );
            setEliminarTarget(null);
            addToast({ variant: "success", title: "Proveedor eliminado", message: `${nombre} fue eliminado correctamente.` });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error al eliminar";
            setError(msg);
            addToast({ variant: "error", title: "Error", message: msg });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Proveedores</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Gestión de proveedores y donaciones.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-10 gap-2 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                >
                    <Link to="/proveedores/nuevo">
                        <Plus className="h-4 w-4" />
                        Registrar proveedor
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
                                {pagination.total} resultados
                            </span>
                            <span>Proveedores registrados</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="group flex h-11 w-[280px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                                    <Search className="h-4 w-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o RNC"
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
                        <div className="grid grid-cols-[1fr_1.5fr_1fr_1.2fr_1fr_0.9fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>RNC</span>
                            <span>Nombre</span>
                            <span>Teléfono</span>
                            <span>Correo</span>
                            <span>Ciudad</span>
                            <span>Acciones</span>
                        </div>

                        {isLoading ? (
                            <div className="py-16 text-center">
                                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-donamed-light border-t-donamed-primary" />
                                <p className="mt-3 text-sm text-[#5B5B5B]">
                                    Cargando proveedores...
                                </p>
                            </div>
                        ) : (
                            <>
                                {proveedores.map((proveedor) => (
                                    <div
                                        key={proveedor.rncproveedor}
                                        className="grid grid-cols-[1fr_1.5fr_1fr_1.2fr_1fr_0.9fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                    >
                                        <span className="font-medium">
                                            {proveedor.rncproveedor}
                                        </span>
                                        <span>{proveedor.nombre}</span>
                                        <span>{proveedor.telefono ?? "—"}</span>
                                        <span>{proveedor.correo ?? "—"}</span>
                                        <span>
                                            {proveedor.ciudad?.nombre ??
                                                proveedor.codigociudad ??
                                                "—"}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/proveedores/${encodeURIComponent(proveedor.rncproveedor)}`}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                                title="Ver detalle"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                to={`/proveedores/${encodeURIComponent(proveedor.rncproveedor)}/editar`}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                                title="Editar"
                                            >
                                                <PencilLine className="h-4 w-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => setEliminarTarget(proveedor)}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-danger transition hover:border-danger/40 hover:bg-danger/5"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {proveedores.length === 0 && (
                                    <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                        No se encontraron proveedores
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
                                    Eliminar proveedor
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-[#1E1E1E]">
                                    {eliminarTarget.nombre}
                                </h3>
                                <p className="mt-2 text-sm text-[#5B5B5B]/80">
                                    ¿Estás seguro? No se puede eliminar si tiene donaciones
                                    asociadas.
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
