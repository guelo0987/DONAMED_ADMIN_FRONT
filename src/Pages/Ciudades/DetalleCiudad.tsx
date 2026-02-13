import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ciudadesMock: Record<string, { id: string; nombre: string; provincia: string; codigo: string; estado: string }> = {
    "CIU-001": { id: "CIU-001", nombre: "Bogotá", provincia: "Cundinamarca", codigo: "11001", estado: "Activo" },
    "CIU-002": { id: "CIU-002", nombre: "Medellín", provincia: "Antioquia", codigo: "05001", estado: "Activo" },
    "CIU-003": { id: "CIU-003", nombre: "Cali", provincia: "Valle del Cauca", codigo: "76001", estado: "Activo" },
    "CIU-004": { id: "CIU-004", nombre: "Barranquilla", provincia: "Atlántico", codigo: "08001", estado: "Activo" },
    "CIU-005": { id: "CIU-005", nombre: "Cartagena", provincia: "Bolívar", codigo: "13001", estado: "Inactivo" },
};

export function DetalleCiudad() {
    const navigate = useNavigate();
    const { id } = useParams();
    const detalle = useMemo(() => {
        if (!id) return null;
        return ciudadesMock[id] ?? { id, nombre: "Ciudad", provincia: "", codigo: "", estado: "Activo" };
    }, [id]);

    if (!detalle) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/ciudades")}
                        className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                    >
                        ← Volver a ciudades
                    </button>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Detalle de la ciudad</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">Información general y estado actual.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button asChild className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark">
                        <a href={`/ciudades/${detalle.id}/editar`}>Editar ciudad</a>
                    </Button>
                    <Button type="button" variant="outline" className="h-10 rounded-xl border-2 border-donamed-primary text-donamed-primary">
                        {detalle.estado === "Activo" ? "Desactivar" : "Activar"}
                    </Button>
                    <Button type="button" variant="outline" className="h-10 rounded-xl bg-[#1C5961] px-6 text-white hover:bg-[#16484F]">
                        Eliminar
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Código</span>
                            <span className="text-[#2D3748]">{detalle.id}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Nombre</span>
                            <span className="text-[#2D3748]">{detalle.nombre}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Provincia</span>
                            <span className="text-[#2D3748]">{detalle.provincia}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Código postal</span>
                            <span className="text-[#2D3748]">{detalle.codigo}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Estado</span>
                            <span
                                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                    detalle.estado === "Activo" ? "bg-success-light text-success" : "bg-warning-light text-warning"
                                }`}
                            >
                                {detalle.estado}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
