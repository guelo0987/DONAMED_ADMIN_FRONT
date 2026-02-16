import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ubicacionService } from "@/services/ubicacionService";
import { useToast } from "@/contexts/ToastContext";
import type { Provincia } from "@/types/persona.types";

export function RegistrarCiudad() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [codigociudad, setCodigociudad] = useState("");
    const [nombre, setNombre] = useState("");
    const [codigoprovincia, setCodigoprovincia] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingProvincias, setIsLoadingProvincias] = useState(true);

    useEffect(() => {
        let cancelled = false;
        ubicacionService.getProvincias().then((data) => {
            if (!cancelled) {
                setProvincias(data);
                if (data.length > 0 && !codigoprovincia) setCodigoprovincia(data[0].codigoprovincia);
                setIsLoadingProvincias(false);
            }
        }).catch(() => {
            if (!cancelled) setIsLoadingProvincias(false);
        });
        return () => { cancelled = true; };
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!codigociudad.trim() || !nombre.trim() || !codigoprovincia) {
            addToast({ variant: "error", title: "Campos requeridos", message: "Código, nombre y provincia son obligatorios." });
            return;
        }
        setIsSubmitting(true);
        try {
            await ubicacionService.createCiudad({
                codigociudad: codigociudad.trim(),
                nombre: nombre.trim(),
                codigoprovincia,
            });
            addToast({ variant: "success", title: "Ciudad registrada", message: `${nombre} fue creada correctamente.` });
            navigate("/ciudades");
        } catch (err) {
            addToast({ variant: "error", title: "Error", message: err instanceof Error ? err.message : "Error al registrar ciudad." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/ciudades")}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a ciudades
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">Registrar ciudad</h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Completa la información de la ciudad.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Código ciudad</span>
                                <input
                                    type="text"
                                    value={codigociudad}
                                    onChange={(e) => setCodigociudad(e.target.value)}
                                    placeholder="Ej: 11001"
                                    maxLength={10}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Nombre</span>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ej: Bogotá"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm md:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Provincia</span>
                                <select
                                    value={codigoprovincia}
                                    onChange={(e) => setCodigoprovincia(e.target.value)}
                                    disabled={isLoadingProvincias}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Seleccione provincia</option>
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
                    <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => navigate("/ciudades")}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="h-11 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark" disabled={isSubmitting}>
                        {isSubmitting ? "Guardando..." : "Guardar ciudad"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
