import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface DespachoDetalle {
    id: string;
    solicitud: string;
    paciente: string;
    centro: string;
    fechaSolicitud: string;
    tipo: string;
    fechaDespacho: string;
    persona: {
        nombre: string;
        cedula: string;
        telefono: string;
        correo: string;
    };
}

const detalleMock: DespachoDetalle = {
    id: "D-9001",
    solicitud: "S-023869869",
    paciente: "Maria del Carmen",
    centro: "Centro Medico Norte",
    fechaSolicitud: "2025-09-24",
    tipo: "Urgente",
    fechaDespacho: "2025-09-26 11:00",
    persona: {
        nombre: "Carlos Gomez",
        cedula: "1022334455",
        telefono: "+57 310 555 2211",
        correo: "carlos.gomez@donamed.com",
    },
};

export function DetalleDespacho() {
    const navigate = useNavigate();
    const { id } = useParams();
    const detalle = useMemo(() => {
        if (!id) return detalleMock;
        return { ...detalleMock, id };
    }, [id]);

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/despachos/historial")}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a historial
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Detalle de Despacho
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Informacion de la solicitud y persona que recibe.
                </p>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <h2 className="text-base font-semibold text-[#1E1E1E]">
                        Detalle de la solicitud
                    </h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Numero de solicitud
                            </span>
                            <span className="text-[#2D3748]">{detalle.solicitud}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Fecha de solicitud
                            </span>
                            <span className="text-[#2D3748]">{detalle.fechaSolicitud}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Tipo de solicitud
                            </span>
                            <span className="text-[#2D3748]">{detalle.tipo}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Fecha de despacho
                            </span>
                            <span className="text-[#2D3748]">{detalle.fechaDespacho}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Paciente
                            </span>
                            <span className="text-[#2D3748]">{detalle.paciente}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Centro medico
                            </span>
                            <span className="text-[#2D3748]">{detalle.centro}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <h2 className="text-base font-semibold text-[#1E1E1E]">
                        Detalle del paciente
                    </h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Nombre
                            </span>
                            <span className="text-[#2D3748]">{detalle.persona.nombre}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Cedula
                            </span>
                            <span className="text-[#2D3748]">{detalle.persona.cedula}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Telefono
                            </span>
                            <span className="text-[#2D3748]">{detalle.persona.telefono}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Correo
                            </span>
                            <span className="text-[#2D3748]">{detalle.persona.correo}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
