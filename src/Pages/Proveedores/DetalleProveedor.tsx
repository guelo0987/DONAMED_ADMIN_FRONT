import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const detalleMock = {
    id: "PR-1001",
    nombre: "Laboratorios Sanar",
    contacto: "Laura Perez",
    telefono: "+57 300 555 1122",
    correo: "contacto@sanar.com",
    ciudad: "Bogota",
    direccion: "Calle 72 #10-45",
    estado: "Activo",
};

export function DetalleProveedor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const detalle = useMemo(() => {
        if (!id) return detalleMock;
        return { ...detalleMock, id };
    }, [id]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/proveedores")}
                        className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                    >
                        ← Volver a proveedores
                    </button>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                        Detalle del proveedor
                    </h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Informacion general y estado actual.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        asChild
                        className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                    >
                        <a href={`/proveedores/${detalle.id}/editar`}>Editar proveedor</a>
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Proveedor
                            </span>
                            <span className="text-[#2D3748]">{detalle.nombre}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Contacto
                            </span>
                            <span className="text-[#2D3748]">{detalle.contacto}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Telefono
                            </span>
                            <span className="text-[#2D3748]">{detalle.telefono}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Correo
                            </span>
                            <span className="text-[#2D3748]">{detalle.correo}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Ciudad
                            </span>
                            <span className="text-[#2D3748]">{detalle.ciudad}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Direccion
                            </span>
                            <span className="text-[#2D3748]">{detalle.direccion}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Estado
                            </span>
                            <span className="text-[#2D3748]">{detalle.estado}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
