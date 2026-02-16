import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { catalogoService } from "@/services/catalogoService";
import { useToast } from "@/contexts/ToastContext";
import type { Enfermedad } from "@/types/catalogo.types";

export function EditarCategoriaEnfermedad() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addToast } = useToast();
    const [enfermedad, setEnfermedad] = useState<Enfermedad | null>(null);
    const [nombre, setNombre] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEnfermedad = useCallback(async () => {
        const idNum = id ? parseInt(id, 10) : NaN;
        if (!id || isNaN(idNum)) return;
        setIsLoading(true);
        setError(null);
        try {
            const enfermedades = await catalogoService.getEnfermedades();
            const found = enfermedades.find((e) => e.idenfermedad === idNum);
            if (found) {
                setEnfermedad(found);
                setNombre(found.nombre);
            } else {
                setError("Categoría no encontrada");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar categoría");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEnfermedad();
    }, [fetchEnfermedad]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!enfermedad || !nombre.trim()) return;
        setIsSubmitting(true);
        try {
            await catalogoService.updateEnfermedad(enfermedad.idenfermedad, { nombre: nombre.trim() });
            addToast({ variant: "success", title: "Categoría actualizada", message: `${nombre} fue actualizada correctamente.` });
            navigate(`/categorias-enfermedades/${enfermedad.idenfermedad}`);
        } catch (err) {
            addToast({ variant: "error", title: "Error", message: err instanceof Error ? err.message : "Error al actualizar categoría." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="text-sm text-[#5B5B5B]/60">Cargando categoría...</div>
            </div>
        );
    }

    if (error || !enfermedad) {
        return (
            <div className="space-y-6">
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error ?? "Categoría no encontrada"}
                </div>
                <Button variant="outline" onClick={() => navigate("/categorias-enfermedades")} className="rounded-xl">
                    Volver a categorías de enfermedades
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate(`/categorias-enfermedades/${enfermedad.idenfermedad}`)}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a la categoría
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">Editar categoría</h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Actualiza la información de la categoría de enfermedades.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <div className="grid gap-4">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Código
                                </span>
                                <span className="h-10 rounded-lg border border-[#E7E7E7] bg-[#FBFBFC] px-3 py-2 text-sm text-[#5B5B5B]">
                                    {enfermedad.idenfermedad}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Nombre
                                </span>
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
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl"
                        onClick={() => navigate(`/categorias-enfermedades/${enfermedad.idenfermedad}`)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="h-11 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
