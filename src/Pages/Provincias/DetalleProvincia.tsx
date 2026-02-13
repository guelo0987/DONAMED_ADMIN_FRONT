import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const provinciasMock: Record<string, { id: string; nombre: string; pais: string; descripcion: string; estado: string }> = {
    "PRO-001": { id: "PRO-001", nombre: "Cundinamarca", pais: "Colombia", descripcion: "Departamento del centro del país. Incluye la capital Bogotá.", estado: "Activo" },
    "PRO-002": { id: "PRO-002", nombre: "Antioquia", pais: "Colombia", descripcion: "Departamento del noroccidente colombiano.", estado: "Activo" },
    "PRO-003": { id: "PRO-003", nombre: "Valle del Cauca", pais: "Colombia", descripcion: "Departamento del suroccidente colombiano.", estado: "Activo" },
    "PRO-004": { id: "PRO-004", nombre: "Atlántico", pais: "Colombia", descripcion: "Departamento de la costa Caribe colombiana.", estado: "Activo" },
    "PRO-005": { id: "PRO-005", nombre: "Bolívar", pais: "Colombia", descripcion: "Departamento del Caribe colombiano.", estado: "Inactivo" },
};

export function DetalleProvincia() {
    const navigate = useNavigate();
    const { id } = useParams();
    const detalle = useMemo(() => {
        if (!id) return null;
        return provinciasMock[id] ?? { id, nombre: "Provincia", pais: "", descripcion: "", estado: "Activo" };
    }, [id]);

    if (!detalle) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/provincias")}
                        className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                    >
                        ← Volver a provincias
                    </button>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Detalle de la provincia</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">Información general y estado actual.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button asChild className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark">
                        <a href={`/provincias/${detalle.id}/editar`}>Editar provincia</a>
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
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Código</span>
                            <span className="text-[#2D3748]">{detalle.id}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Nombre</span>
                            <span className="text-[#2D3748]">{detalle.nombre}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">País</span>
                            <span className="text-[#2D3748]">{detalle.pais}</span>
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
                        <div className="flex flex-col gap-1 text-sm md:col-span-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Descripción</span>
                            <span className="text-[#2D3748]">{detalle.descripcion || "—"}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
