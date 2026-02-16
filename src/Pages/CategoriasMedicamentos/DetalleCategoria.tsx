import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { catalogoService } from "@/services/catalogoService";
import { useToast } from "@/contexts/ToastContext";
import type { Categoria } from "@/types/catalogo.types";

export function DetalleCategoria() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addToast } = useToast();
    const [categoria, setCategoria] = useState<Categoria | null>(null);
    const [eliminarTarget, setEliminarTarget] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategoria = useCallback(async () => {
        const idNum = id ? parseInt(id, 10) : NaN;
        if (!id || isNaN(idNum)) return;
        setIsLoading(true);
        setError(null);
        try {
            const categorias = await catalogoService.getCategorias();
            const found = categorias.find((c) => c.idcategoria === idNum);
            if (found) setCategoria(found);
            else setError("Categoría no encontrada");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar categoría");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCategoria();
    }, [fetchCategoria]);

    const handleEliminar = async () => {
        if (!categoria) return;
        const nombre = categoria.nombre;
        try {
            await catalogoService.deleteCategoria(categoria.idcategoria);
            addToast({ variant: "success", title: "Categoría eliminada", message: `${nombre} fue eliminada correctamente.` });
            navigate("/categorias");
        } catch (err) {
            addToast({ variant: "error", title: "Error", message: err instanceof Error ? err.message : "Error al eliminar categoría." });
            setEliminarTarget(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="text-sm text-[#5B5B5B]/60">Cargando categoría...</div>
            </div>
        );
    }

    if (error || !categoria) {
        return (
            <div className="space-y-6">
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error ?? "Categoría no encontrada"}
                </div>
                <Button variant="outline" onClick={() => navigate("/categorias")} className="rounded-xl">
                    Volver a categorías
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/categorias")}
                        className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                    >
                        ← Volver a categorías
                    </button>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                        Detalle de la categoría
                    </h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Información general.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        asChild
                        className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                    >
                        <Link to={`/categorias/${categoria.idcategoria}/editar`}>Editar categoría</Link>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-xl bg-[#1C5961] px-6 text-white hover:bg-[#16484F]"
                        onClick={() => setEliminarTarget(true)}
                    >
                        Eliminar
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Código
                            </span>
                            <span className="text-[#2D3748]">{categoria.idcategoria}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Nombre
                            </span>
                            <span className="text-[#2D3748]">{categoria.nombre}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {eliminarTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-[#1E1E1E]">Eliminar categoría</h3>
                        <p className="mt-2 text-sm text-[#5B5B5B]">
                            ¿Está seguro de eliminar la categoría &quot;{categoria.nombre}&quot;? Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setEliminarTarget(false)} className="rounded-xl">
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
