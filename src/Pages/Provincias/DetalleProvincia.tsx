import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ubicacionService } from "@/services/ubicacionService";
import { useToast } from "@/contexts/ToastContext";
import type { ProvinciaConCiudades } from "@/services/ubicacionService";

export function DetalleProvincia() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addToast } = useToast();
    const [provincia, setProvincia] = useState<ProvinciaConCiudades | null>(null);
    const [eliminarTarget, setEliminarTarget] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProvincia = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const provincias = await ubicacionService.getProvincias();
            const found = provincias.find((p) => p.codigoprovincia === id);
            if (found) setProvincia(found);
            else setError("Provincia no encontrada");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar provincia");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProvincia();
    }, [fetchProvincia]);

    const handleEliminar = async () => {
        if (!provincia) return;
        const nombre = provincia.nombre;
        try {
            await ubicacionService.deleteProvincia(provincia.codigoprovincia);
            addToast({ variant: "success", title: "Provincia eliminada", message: `${nombre} fue eliminada correctamente.` });
            navigate("/provincias");
        } catch (err) {
            addToast({ variant: "error", title: "Error", message: err instanceof Error ? err.message : "Error al eliminar provincia." });
            setEliminarTarget(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="text-sm text-[#5B5B5B]/60">Cargando provincia...</div>
            </div>
        );
    }

    if (error || !provincia) {
        return (
            <div className="space-y-6">
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error ?? "Provincia no encontrada"}
                </div>
                <Button variant="outline" onClick={() => navigate("/provincias")} className="rounded-xl">
                    Volver a provincias
                </Button>
            </div>
        );
    }

    const ciudades = provincia.ciudad ?? [];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/provincias")}
                        className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                    >
                        ← Volver a provincias
                    </button>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Detalle de la provincia</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">Información general.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button asChild className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark">
                        <Link to={`/provincias/${provincia.codigoprovincia}/editar`}>Editar provincia</Link>
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
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Código</span>
                            <span className="text-[#2D3748]">{provincia.codigoprovincia}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Nombre</span>
                            <span className="text-[#2D3748]">{provincia.nombre}</span>
                        </div>
                        {ciudades.length > 0 && (
                            <div className="flex flex-col gap-1 text-sm md:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Ciudades ({ciudades.length})</span>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {ciudades.map((c) => (
                                        <Link
                                            key={c.codigociudad}
                                            to={`/ciudades/${c.codigociudad}`}
                                            className="rounded-lg bg-donamed-light px-3 py-1.5 text-sm font-medium text-donamed-dark hover:bg-donamed-primary hover:text-white"
                                        >
                                            {c.nombre}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {eliminarTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-[#1E1E1E]">Eliminar provincia</h3>
                        <p className="mt-2 text-sm text-[#5B5B5B]">
                            ¿Está seguro de eliminar la provincia &quot;{provincia.nombre}&quot;? Esta acción no se puede deshacer.
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
