import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SolicitudDetalle {
    id: string;
    paciente: string;
    centro: string;
    fechaSolicitud: string;
    tipo: string;
    medicamentos: Array<{
        id: string;
        nombre: string;
        cantidadSolicitada: number;
        lote: string;
        cantidadDespachada: number;
        almacen: string;
    }>;
}

const detalleMock: SolicitudDetalle = {
    id: "S-023869869",
    paciente: "Maria del Carmen",
    centro: "Centro Medico Norte",
    fechaSolicitud: "2025-09-24",
    tipo: "Urgente",
    medicamentos: [
        {
            id: "med-1",
            nombre: "Paracetamol 500mg",
            cantidadSolicitada: 120,
            lote: "L-2389",
            cantidadDespachada: 120,
            almacen: "Central",
        },
        {
            id: "med-2",
            nombre: "Amoxicilina 500mg",
            cantidadSolicitada: 80,
            lote: "A-5521",
            cantidadDespachada: 60,
            almacen: "Norte",
        },
    ],
};

export function CrearDespacho() {
    const navigate = useNavigate();
    const { id } = useParams();
    const detalle = useMemo(() => {
        if (!id) return detalleMock;
        return { ...detalleMock, id };
    }, [id]);

    const [fechaDespacho] = useState("2025-09-26 10:30");
    const [cedula, setCedula] = useState("");
    const [medicamentos, setMedicamentos] = useState(detalle.medicamentos);

    const handleChange = (
        index: number,
        field: keyof SolicitudDetalle["medicamentos"][number],
        value: string | number
    ) => {
        const next = [...medicamentos];
        next[index] = { ...next[index], [field]: value };
        setMedicamentos(next);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // TODO: Implement dispatch logic
        navigate("/despachos");
    };

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/despachos")}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a despachos
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">Crear Despacho</h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Confirma la solicitud y asigna los lotes disponibles.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">
                            Informacion de la solicitud
                        </h2>
                        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Numero de solicitud
                                </span>
                                <span className="text-[#2D3748]">{detalle.id}</span>
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
                                    Paciente / Centro medico
                                </span>
                                <span className="text-[#2D3748]">
                                    {detalle.paciente} · {detalle.centro}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Fecha de despacho
                                </span>
                                <input
                                    type="text"
                                    value={fechaDespacho}
                                    readOnly
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-[#F7F7F7] px-3 text-sm text-[#404040] focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Persona que recibe (cedula)
                                </span>
                                <input
                                    type="text"
                                    value={cedula}
                                    onChange={(e) => setCedula(e.target.value)}
                                    placeholder="Cedula del receptor"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-0">
                        <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                            <h2 className="text-base font-semibold text-[#1E1E1E]">
                                Medicamentos solicitados
                            </h2>
                            <p className="text-sm text-[#5B5B5B]/70">
                                Selecciona lote, cantidad despachada y almacen de salida.
                            </p>
                        </div>

                        <div className="w-full">
                            <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr_1fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                <span>Medicamento</span>
                                <span>Cant. solicitada</span>
                                <span>Lote</span>
                                <span>Cant. despachada</span>
                                <span>Almacen salida</span>
                            </div>

                            {medicamentos.map((med, index) => (
                                <div
                                    key={med.id}
                                    className="grid grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr_1fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                >
                                    <span className="font-medium">{med.nombre}</span>
                                    <span>{med.cantidadSolicitada}</span>
                                    <input
                                        type="text"
                                        value={med.lote}
                                        onChange={(e) =>
                                            handleChange(index, "lote", e.target.value)
                                        }
                                        className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    />
                                    <input
                                        type="number"
                                        value={med.cantidadDespachada}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "cantidadDespachada",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    />
                                    <input
                                        type="text"
                                        value={med.almacen}
                                        onChange={(e) =>
                                            handleChange(index, "almacen", e.target.value)
                                        }
                                        className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl"
                        onClick={() => navigate("/despachos")}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" className="h-11 rounded-xl">
                        Confirmar despacho
                    </Button>
                </div>
            </form>
        </div>
    );
}
