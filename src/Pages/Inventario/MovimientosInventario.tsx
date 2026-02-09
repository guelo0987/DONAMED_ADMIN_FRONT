import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

type MovimientoTipo = "Entrada" | "Salida";

interface MovimientoItem {
    id: string;
    tipo: MovimientoTipo;
    usuario: string;
    fecha: string;
    referencia: string;
}

const movimientosData: MovimientoItem[] = [
    {
        id: "M-1001",
        tipo: "Entrada",
        usuario: "Laura P.",
        fecha: "2025-09-24 10:40",
        referencia: "Donacion D-24589",
    },
    {
        id: "M-1002",
        tipo: "Salida",
        usuario: "Carlos M.",
        fecha: "2025-09-25 08:10",
        referencia: "Solicitud S-023869869",
    },
    {
        id: "M-1003",
        tipo: "Salida",
        usuario: "Diana R.",
        fecha: "2025-09-26 15:22",
        referencia: "Despacho DP-1104",
    },
];

const tipoStyles: Record<MovimientoTipo, string> = {
    Entrada: "bg-success-light text-success",
    Salida: "bg-warning-light text-warning",
};

export function MovimientosInventario() {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/inventario")}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a inventario
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Movimientos de Inventario
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Historial de entradas por donaciones validadas y salidas por despachos.
                </p>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="w-full">
                        <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr_0.7fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Tipo</span>
                            <span>Usuario</span>
                            <span>Fecha</span>
                            <span>Referencia</span>
                            <span>Acciones</span>
                        </div>

                        {movimientosData.map((mov) => (
                            <div
                                key={mov.id}
                                className="grid grid-cols-[1fr_1fr_1fr_1.5fr_0.7fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${tipoStyles[mov.tipo]}`}
                                >
                                    {mov.tipo}
                                </span>
                                <span>{mov.usuario}</span>
                                <span>{mov.fecha}</span>
                                <span>{mov.referencia}</span>
                                <button className="inline-flex h-9 items-center justify-center rounded-xl bg-donamed-primary px-3 text-xs font-semibold text-white transition hover:bg-donamed-dark">
                                    Ver detalle
                                </button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
