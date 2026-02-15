import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categoriasMock: Record<string, { id: string; nombre: string; descripcion: string }> = {
    "CAT-001": {
        id: "CAT-001",
        nombre: "Antibióticos",
        descripcion: "Medicamentos para el tratamiento de infecciones bacterianas",
    },
    "CAT-002": {
        id: "CAT-002",
        nombre: "Analgésicos",
        descripcion: "Medicamentos para aliviar el dolor",
    },
    "CAT-003": {
        id: "CAT-003",
        nombre: "Antidiabéticos",
        descripcion: "Medicamentos para el control de la diabetes",
    },
    "CAT-004": {
        id: "CAT-004",
        nombre: "Antiinflamatorios",
        descripcion: "Medicamentos para reducir la inflamación",
    },
};

export function EditarCategoria() {
    const navigate = useNavigate();
    const { id } = useParams();
    const detalle = useMemo(() => {
        if (!id) return null;
        return categoriasMock[id] ?? { id, nombre: "", descripcion: "" };
    }, [id]);

    const [nombre, setNombre] = useState(detalle?.nombre ?? "");
    const [descripcion, setDescripcion] = useState(detalle?.descripcion ?? "");

    useEffect(() => {
        if (detalle) {
            setNombre(detalle.nombre);
            setDescripcion(detalle.descripcion);
        }
    }, [detalle?.id]);

    if (!detalle) return null;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // TODO: Implement save logic
        navigate(`/categorias/${detalle.id}`);
    };

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate(`/categorias/${detalle.id}`)}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a la categoría
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">Editar categoría</h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Actualiza la información de la categoría.
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
                                    {detalle.id}
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
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Descripción
                                </span>
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
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl"
                        onClick={() => navigate(`/categorias/${detalle.id}`)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="h-11 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                    >
                        Guardar cambios
                    </Button>
                </div>
            </form>
        </div>
    );
}
