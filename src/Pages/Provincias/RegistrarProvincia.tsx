import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RegistrarProvincia() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [pais, setPais] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        navigate("/provincias");
    };

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/provincias")}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a provincias
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">Registrar provincia</h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Completa la información de la provincia.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <div className="grid gap-4">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Nombre</span>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ej: Cundinamarca"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">País</span>
                                <input
                                    type="text"
                                    value={pais}
                                    onChange={(e) => setPais(e.target.value)}
                                    placeholder="Ej: Colombia"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Descripción</span>
                                <textarea
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    placeholder="Descripción de la provincia"
                                    rows={4}
                                    className="rounded-lg border border-[#E7E7E7] px-3 py-2 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => navigate("/provincias")}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="h-11 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark">
                        Guardar provincia
                    </Button>
                </div>
            </form>
        </div>
    );
}
