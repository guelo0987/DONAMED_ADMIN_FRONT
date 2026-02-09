import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EstadoDonacion = "Registrada" | "Validada" | "Rechazada" | "Cancelada";

interface DonacionDetalle {
    id: string;
    donante: string;
    fechaDonacion: string;
    estado: EstadoDonacion;
    registradoPor: string;
    fechaRegistro: string;
    totalMedicamentos: number;
    totalUnidades: number;
    proximosVencer: number;
    vencidos: number;
    medicamentos: Array<{
        id: string;
        nombre: string;
        forma: string;
        via: string;
        lote: string;
        vencimiento: string;
        cantidad: number;
        observaciones: string;
    }>;
}

const detalleMock: DonacionDetalle = {
    id: "D-24589",
    donante: "Laboratorios Sanar",
    fechaDonacion: "2025-09-24",
    estado: "Registrada",
    registradoPor: "Laura P.",
    fechaRegistro: "2025-09-24 10:35",
    totalMedicamentos: 12,
    totalUnidades: 320,
    proximosVencer: 3,
    vencidos: 0,
    medicamentos: [
        {
            id: "med-1",
            nombre: "Paracetamol 500mg",
            forma: "Tableta",
            via: "Oral",
            lote: "L-2389",
            vencimiento: "2026-02-15",
            cantidad: 120,
            observaciones: "Caja en perfecto estado",
        },
        {
            id: "med-2",
            nombre: "Amoxicilina 500mg",
            forma: "Cápsula",
            via: "Oral",
            lote: "A-5521",
            vencimiento: "2025-12-05",
            cantidad: 80,
            observaciones: "Revisar empaque exterior",
        },
        {
            id: "med-3",
            nombre: "Salbutamol",
            forma: "Inhalador",
            via: "Inhalatoria",
            lote: "S-7410",
            vencimiento: "2025-11-10",
            cantidad: 40,
            observaciones: "Incluye boquillas",
        },
    ],
};

const statusStyles: Record<EstadoDonacion, string> = {
    Registrada: "bg-donamed-light text-donamed-dark",
    Validada: "bg-success-light text-success",
    Rechazada: "bg-danger-light text-danger",
    Cancelada: "bg-warning-light text-warning",
};

export function DetalleDonacion() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showValidation, setShowValidation] = useState(false);
    const donacion = useMemo(() => {
        if (!id) {
            return detalleMock;
        }
        return { ...detalleMock, id };
    }, [id]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/donaciones")}
                        className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                    >
                        ← Volver a donaciones
                    </button>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                        Detalle de Donación
                    </h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Información completa y trazabilidad de la donación registrada.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setShowValidation(true)}
                        className="flex h-10 items-center justify-center rounded-xl border-2 border-[#33C5D8] bg-[#F3F3F3] px-5 text-sm font-semibold text-[#33C5D8] transition hover:bg-[#EDEDED]"
                    >
                        Validar
                    </button>
                    <Button
                        asChild
                        className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                    >
                        <Link to={`/donaciones/${donacion.id}/editar`}>Editar Donación</Link>
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Código de donación
                            </p>
                            <p className="mt-1 text-lg font-semibold text-[#1E1E1E]">
                                {donacion.id}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span
                                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[donacion.estado]}`}
                            >
                                {donacion.estado}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Donante / Proveedor
                            </span>
                            <span className="text-[#2D3748]">{donacion.donante}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Fecha de donación
                            </span>
                            <span className="text-[#2D3748]">{donacion.fechaDonacion}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Usuario que registró
                            </span>
                            <span className="text-[#2D3748]">{donacion.registradoPor}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Fecha de registro
                            </span>
                            <span className="text-[#2D3748]">{donacion.fechaRegistro}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {showValidation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-[0px_30px_80px_-40px_rgba(0,0,0,0.6)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Validar donación
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-[#1E1E1E]">
                                    {donacion.id} · {donacion.donante}
                                </h3>
                                <p className="mt-2 text-sm text-[#5B5B5B]/80">
                                    Selecciona una acción para actualizar el estado de la donación.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowValidation(false)}
                                className="rounded-lg border border-[#E7E7E7] px-3 py-1 text-sm text-[#5B5B5B] hover:bg-[#F7F7F7]"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <Button
                                type="button"
                                className="h-11 gap-2 rounded-xl bg-success text-white hover:bg-success/90"
                                onClick={() => setShowValidation(false)}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Aceptar
                            </Button>
                            <Button
                                type="button"
                                className="h-11 gap-2 rounded-xl bg-danger text-white hover:bg-danger/90"
                                onClick={() => setShowValidation(false)}
                            >
                                <XCircle className="h-4 w-4" />
                                Rechazar
                            </Button>
                            <Button
                                type="button"
                                className="h-11 gap-2 rounded-xl bg-warning text-white hover:bg-warning/90"
                                onClick={() => setShowValidation(false)}
                            >
                                <Ban className="h-4 w-4" />
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            Total de medicamentos
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">
                            {donacion.totalMedicamentos}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            Total de unidades
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">
                            {donacion.totalUnidades}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            Próximos a vencer
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-warning">
                            {donacion.proximosVencer}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            Vencidos
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-danger">
                            {donacion.vencidos}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">
                            Medicamentos donados
                        </h2>
                        <p className="text-sm text-[#5B5B5B]/70">
                            Detalle de medicamentos incluidos en la donación.
                        </p>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr_1fr_0.7fr_1.4fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Medicamento</span>
                            <span>Forma</span>
                            <span>Vía</span>
                            <span>Lote</span>
                            <span>Vencimiento</span>
                            <span>Cantidad</span>
                            <span>Observaciones</span>
                        </div>

                        {donacion.medicamentos.map((med) => (
                            <div
                                key={med.id}
                                className="grid grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr_1fr_0.7fr_1.4fr] gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <span className="font-medium">{med.nombre}</span>
                                <span>{med.forma}</span>
                                <span>{med.via}</span>
                                <span>{med.lote}</span>
                                <span>{med.vencimiento}</span>
                                <span>{med.cantidad}</span>
                                <span className="text-[#5B5B5B]">{med.observaciones}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
