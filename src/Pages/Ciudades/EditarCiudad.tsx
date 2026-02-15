import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ciudadesMock: Record<string, { id: string; nombre: string; provincia: string; codigo: string }> = {
    "CIU-001": { id: "CIU-001", nombre: "Bogotá", provincia: "Cundinamarca", codigo: "11001" },
    "CIU-002": { id: "CIU-002", nombre: "Medellín", provincia: "Antioquia", codigo: "05001" },
    "CIU-003": { id: "CIU-003", nombre: "Cali", provincia: "Valle del Cauca", codigo: "76001" },
    "CIU-004": { id: "CIU-004", nombre: "Barranquilla", provincia: "Atlántico", codigo: "08001" },
    "CIU-005": { id: "CIU-005", nombre: "Cartagena", provincia: "Bolívar", codigo: "13001" },
};

export function EditarCiudad() {
    const navigate = useNavigate();
    const { id } = useParams();
    const detalle = useMemo(() => {
        if (!id) return null;
        return ciudadesMock[id] ?? { id, nombre: "", provincia: "", codigo: "" };
    }, [id]);

    const [nombre, setNombre] = useState(detalle?.nombre ?? "");
    const [provincia, setProvincia] = useState(detalle?.provincia ?? "");
    const [codigo, setCodigo] = useState(detalle?.codigo ?? "");

    useEffect(() => {
        if (detalle) {
            setNombre(detalle.nombre);
            setProvincia(detalle.provincia);
            setCodigo(detalle.codigo);
        }
    }, [detalle?.id]);

    if (!detalle) return null;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        navigate(`/ciudades/${detalle.id}`);
    };

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate(`/ciudades/${detalle.id}`)}
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
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Provincia</span>
                                <input
                                    type="text"
                                    value={provincia}
                                    onChange={(e) => setProvincia(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Código postal</span>
                                <input
                                    type="text"
                                    value={codigo}
                                    onChange={(e) => setCodigo(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => navigate(`/ciudades/${detalle.id}`)}>
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
