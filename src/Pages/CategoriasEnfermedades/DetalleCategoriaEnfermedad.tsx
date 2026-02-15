import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categoriasMock: Record<string, { id: string; nombre: string; descripcion: string; estado: string }> = {
    "CEN-001": {
        id: "CEN-001",
        nombre: "Infecciosas",
        descripcion: "Enfermedades causadas por agentes infecciosos (virus, bacterias, hongos, parásitos). Incluyen enfermedades transmisibles y zoonóticas.",
        estado: "Activo",
    },
    "CEN-002": {
        id: "CEN-002",
        nombre: "Crónicas no transmisibles",
        descripcion: "Enfermedades cardiovasculares, diabetes, cáncer, respiratorias crónicas y otras condiciones de larga duración.",
        estado: "Activo",
    },
    "CEN-003": {
        id: "CEN-003",
        nombre: "Cardiovasculares",
        descripcion: "Enfermedades del corazón y del sistema circulatorio.",
        estado: "Activo",
    },
    "CEN-004": {
        id: "CEN-004",
        nombre: "Respiratorias",
        descripcion: "Enfermedades del tracto respiratorio y pulmones.",
        estado: "Activo",
    },
    "CEN-005": {
        id: "CEN-005",
        nombre: "Oncológicas",
        descripcion: "Trastornos relacionados con tumores y cáncer.",
        estado: "Inactivo",
    },
};

export function DetalleCategoriaEnfermedad() {
    const navigate = useNavigate();
    const { id } = useParams();
    const detalle = useMemo(() => {
        if (!id) return null;
        return categoriasMock[id] ?? { id, nombre: "Categoría", descripcion: "", estado: "Activo" };
    }, [id]);

    if (!detalle) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/categorias-enfermedades")}
                        className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                    >
                        ← Volver a categorías de enfermedades
                    </button>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                        Detalle de la categoría
                    </h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Información general y estado actual.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        asChild
                        className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                    >
                        <a href={`/categorias-enfermedades/${detalle.id}/editar`}>Editar categoría</a>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-xl border-2 border-donamed-primary text-donamed-primary"
                    >
                        {detalle.estado === "Activo" ? "Desactivar" : "Activar"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-xl bg-[#1C5961] px-6 text-white hover:bg-[#16484F]"
                    >
                        Eliminar
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Código
                            </span>
                            <span className="text-[#2D3748]">{detalle.id}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Nombre
                            </span>
                            <span className="text-[#2D3748]">{detalle.nombre}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Estado
                            </span>
                            <span
                                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                    detalle.estado === "Activo"
                                        ? "bg-success-light text-success"
                                        : "bg-warning-light text-warning"
                                }`}
                            >
                                {detalle.estado}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm md:col-span-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Descripción
                            </span>
                            <span className="text-[#2D3748]">{detalle.descripcion || "—"}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
