import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { catalogoService } from "@/services/catalogoService";
import { useToast } from "@/contexts/ToastContext";

export function RegistrarCategoriaEnfermedad() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [nombre, setNombre] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!nombre.trim()) {
            addToast({ variant: "error", title: "Campo requerido", message: "El nombre es obligatorio." });
            return;
        }
        setIsSubmitting(true);
        try {
            await catalogoService.createEnfermedad({ nombre: nombre.trim() });
            addToast({ variant: "success", title: "Categoría registrada", message: `${nombre} fue creada correctamente.` });
            navigate("/categorias-enfermedades");
        } catch (err) {
            addToast({ variant: "error", title: "Error", message: err instanceof Error ? err.message : "Error al registrar categoría." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/categorias-enfermedades")}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a categorías de enfermedades
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Registrar categoría de enfermedad
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Completa la información de la categoría de enfermedades.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <div className="grid gap-4">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Nombre
                                </span>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ej: Infecciosas"
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
                        onClick={() => navigate("/categorias-enfermedades")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="h-11 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Guardando..." : "Guardar categoría"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
