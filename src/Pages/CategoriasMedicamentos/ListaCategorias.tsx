import { useCallback, useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { catalogoService } from "@/services/catalogoService";
import { useToast } from "@/contexts/ToastContext";
import type { Categoria } from "@/types/catalogo.types";

export function ListaCategorias() {
    const { addToast } = useToast();
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [search, setSearch] = useState("");
    const [eliminarTarget, setEliminarTarget] = useState<Categoria | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategorias = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await catalogoService.getCategorias();
            setCategorias(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar categorías");
            setCategorias([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    const filtered = categorias.filter((item) => {
        if (search.trim() === "") return true;
        const value = search.toLowerCase();
        return (
            item.nombre.toLowerCase().includes(value) ||
            String(item.idcategoria).includes(value)
        );
    });

    const handleEliminar = async () => {
        if (!eliminarTarget) return;
        const nombre = eliminarTarget.nombre;
        try {
            await catalogoService.deleteCategoria(eliminarTarget.idcategoria);
            setCategorias((prev) => prev.filter((c) => c.idcategoria !== eliminarTarget.idcategoria));
            setEliminarTarget(null);
            addToast({ variant: "success", title: "Categoría eliminada", message: `${nombre} fue eliminada correctamente.` });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error al eliminar";
            addToast({ variant: "error", title: "Error", message: msg });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                        Categorías de medicamentos
                    </h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Gestión de categorías para clasificación del catálogo.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                >
                    <Link to="/categorias/nuevo">Registrar categoría</Link>
                </Button>
            </div>

            {error && (
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error}
                </div>
            )}

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="group flex h-11 flex-1 max-w-sm items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                                <Search className="h-4 w-4 text-[#5B5B5B]" />
                                <input
                                    type="text"
                                    placeholder="Buscar categoría"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[0.8fr_2fr_1.5fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Código</span>
                            <span>Nombre</span>
                            <span>Acciones</span>
                        </div>

                        {isLoading ? (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                Cargando categorías...
                            </div>
                        ) : (
                            <>
                                {filtered.map((item) => (
                                    <div
                                        key={item.idcategoria}
                                        className="grid grid-cols-[0.8fr_2fr_1.5fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                    >
                                        <span className="font-medium">{item.idcategoria}</span>
                                        <span className="font-medium">{item.nombre}</span>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/categorias/${item.idcategoria}`}
                                                className="inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-donamed-primary px-4 text-xs font-semibold text-white transition hover:bg-donamed-dark"
                                            >
                                                Ver detalle
                                            </Link>
                                            <Link
                                                to={`/categorias/${item.idcategoria}/editar`}
                                                className="inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-xl border-2 border-donamed-primary bg-white px-4 text-xs font-semibold text-donamed-primary transition hover:bg-[#F7F7F7]"
                                            >
                                                Editar
                                            </Link>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="h-9 rounded-xl border-danger/30 text-danger hover:bg-danger/10"
                                                onClick={() => setEliminarTarget(item)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {filtered.length === 0 && (
                                    <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                        No se encontraron categorías
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {eliminarTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-[#1E1E1E]">Eliminar categoría</h3>
                        <p className="mt-2 text-sm text-[#5B5B5B]">
                            ¿Está seguro de eliminar la categoría &quot;{eliminarTarget.nombre}&quot;? Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setEliminarTarget(null)} className="rounded-xl">
                                Cancelar
                            </Button>
                            <Button className="rounded-xl bg-danger text-white hover:bg-danger/90" onClick={handleEliminar}>
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
