import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ubicacionService } from "@/services/ubicacionService";
import { useToast } from "@/contexts/ToastContext";
import type { ProvinciaConCiudades } from "@/services/ubicacionService";

export function EditarProvincia() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addToast } = useToast();
    const [provincia, setProvincia] = useState<ProvinciaConCiudades | null>(null);
    const [nombre, setNombre] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProvincia = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const provincias = await ubicacionService.getProvincias();
            const found = provincias.find((p) => p.codigoprovincia === id);
            if (found) {
                setProvincia(found);
                setNombre(found.nombre);
            } else {
                setError("Provincia no encontrada");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar provincia");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProvincia();
    }, [fetchProvincia]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!provincia || !nombre.trim()) return;
        setIsSubmitting(true);
        try {
            await ubicacionService.updateProvincia(provincia.codigoprovincia, { nombre: nombre.trim() });
            addToast({ variant: "success", title: "Provincia actualizada", message: `${nombre} fue actualizada correctamente.` });
            navigate(`/provincias/${provincia.codigoprovincia}`);
        } catch (err) {
            addToast({ variant: "error", title: "Error", message: err instanceof Error ? err.message : "Error al actualizar provincia." });
        } finally {
            setIsSubmitting(false);
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

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate(`/provincias/${provincia.codigoprovincia}`)}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a la provincia
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">Editar provincia</h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">Actualiza la información de la provincia.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <div className="grid gap-4">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Código</span>
                                <span className="h-10 rounded-lg border border-[#E7E7E7] bg-[#FBFBFC] px-3 py-2 text-sm text-[#5B5B5B]">{provincia.codigoprovincia}</span>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Nombre</span>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => navigate(`/provincias/${provincia.codigoprovincia}`)}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="h-11 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark" disabled={isSubmitting}>
                        {isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
