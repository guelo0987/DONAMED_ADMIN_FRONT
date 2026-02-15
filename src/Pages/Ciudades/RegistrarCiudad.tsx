import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RegistrarCiudad() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [provincia, setProvincia] = useState("");
    const [codigo, setCodigo] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        navigate("/ciudades");
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
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Nombre</span>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ej: Bogotá"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Provincia</span>
                                <input
                                    type="text"
                                    value={provincia}
                                    onChange={(e) => setProvincia(e.target.value)}
                                    placeholder="Ej: Cundinamarca"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Código postal</span>
                                <input
                                    type="text"
                                    value={codigo}
                                    onChange={(e) => setCodigo(e.target.value)}
                                    placeholder="Ej: 11001"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => navigate("/ciudades")}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="h-11 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark">
                        Guardar ciudad
                    </Button>
                </div>
            </form>
        </div>
    );
}
