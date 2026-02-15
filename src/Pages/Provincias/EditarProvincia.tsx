import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const provinciasMock: Record<string, { id: string; nombre: string; pais: string; descripcion: string }> = {
    "PRO-001": { id: "PRO-001", nombre: "Cundinamarca", pais: "Colombia", descripcion: "Departamento del centro del país" },
    "PRO-002": { id: "PRO-002", nombre: "Antioquia", pais: "Colombia", descripcion: "Departamento del noroccidente" },
    "PRO-003": { id: "PRO-003", nombre: "Valle del Cauca", pais: "Colombia", descripcion: "Departamento del suroccidente" },
    "PRO-004": { id: "PRO-004", nombre: "Atlántico", pais: "Colombia", descripcion: "Departamento de la costa Caribe" },
    "PRO-005": { id: "PRO-005", nombre: "Bolívar", pais: "Colombia", descripcion: "Departamento del Caribe colombiano" },
};

export function EditarProvincia() {
    const navigate = useNavigate();
    const { id } = useParams();
    const detalle = useMemo(() => {
        if (!id) return null;
        return provinciasMock[id] ?? { id, nombre: "", pais: "", descripcion: "" };
    }, [id]);

    const [nombre, setNombre] = useState(detalle?.nombre ?? "");
    const [pais, setPais] = useState(detalle?.pais ?? "");
    const [descripcion, setDescripcion] = useState(detalle?.descripcion ?? "");

    useEffect(() => {
        if (detalle) {
            setNombre(detalle.nombre);
            setPais(detalle.pais);
            setDescripcion(detalle.descripcion);
        }
    }, [detalle?.id]);

    if (!detalle) return null;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        navigate(`/provincias/${detalle.id}`);
    };

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate(`/provincias/${detalle.id}`)}
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
                                <span className="h-10 rounded-lg border border-[#E7E7E7] bg-[#FBFBFC] px-3 py-2 text-sm text-[#5B5B5B]">{detalle.id}</span>
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
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">País</span>
                                <input
                                    type="text"
                                    value={pais}
                                    onChange={(e) => setPais(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Descripción</span>
                                <textarea
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    rows={4}
                                    className="rounded-lg border border-[#E7E7E7] px-3 py-2 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => navigate(`/provincias/${detalle.id}`)}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="h-11 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark">
                        Guardar cambios
                    </Button>
                </div>
            </form>
        </div>
    );
}
