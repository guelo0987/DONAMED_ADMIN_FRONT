import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ubicacionService } from "@/services/ubicacionService";
import { useToast } from "@/contexts/ToastContext";
import type { Ciudad } from "@/types/persona.types";
import type { Provincia } from "@/types/persona.types";

export function EditarCiudad() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addToast } = useToast();
    const [ciudad, setCiudad] = useState<Ciudad | null>(null);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [nombre, setNombre] = useState("");
    const [codigoprovincia, setCodigoprovincia] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const [ciudadesData, provinciasData] = await Promise.all([
                ubicacionService.getCiudades(),
                ubicacionService.getProvincias(),
            ]);
            const found = ciudadesData.find((c) => c.codigociudad === id);
            if (found) {
                setCiudad(found);
                setNombre(found.nombre);
                setCodigoprovincia(found.codigoprovincia);
            } else {
                setError("Ciudad no encontrada");
            }
            setProvincias(provinciasData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar ciudad");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!ciudad) return;
        setIsSubmitting(true);
        try {
            await ubicacionService.updateCiudad(ciudad.codigociudad, {
                nombre: nombre.trim(),
                codigoprovincia: codigoprovincia || undefined,
            });
            addToast({ variant: "success", title: "Ciudad actualizada", message: `${nombre} fue actualizada correctamente.` });
            navigate(`/ciudades/${ciudad.codigociudad}`);
        } catch (err) {
            addToast({ variant: "error", title: "Error", message: err instanceof Error ? err.message : "Error al actualizar ciudad." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="text-sm text-[#5B5B5B]/60">Cargando ciudad...</div>
            </div>
        );
    }

    if (error || !ciudad) {
        return (
            <div className="space-y-6">
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error ?? "Ciudad no encontrada"}
                </div>
                <Button variant="outline" onClick={() => navigate("/ciudades")} className="rounded-xl">
                    Volver a ciudades
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate(`/ciudades/${ciudad.codigociudad}`)}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a la ciudad
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">Editar ciudad</h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">Actualiza la información de la ciudad.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Código</span>
                                <span className="h-10 rounded-lg border border-[#E7E7E7] bg-[#FBFBFC] px-3 py-2 text-sm text-[#5B5B5B]">{ciudad.codigociudad}</span>
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
                            <div className="flex flex-col gap-2 text-sm md:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Provincia</span>
                                <select
                                    value={codigoprovincia}
                                    onChange={(e) => setCodigoprovincia(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    {provincias.map((p) => (
                                        <option key={p.codigoprovincia} value={p.codigoprovincia}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => navigate(`/ciudades/${ciudad.codigociudad}`)}>
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
