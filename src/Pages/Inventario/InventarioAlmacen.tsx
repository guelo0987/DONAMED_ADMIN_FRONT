import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

type LoteEstado = "Vigente" | "Proximo" | "Vencido";

interface AlmacenItem {
    id: string;
    almacen: string;
    medicamento: string;
    lote: string;
    cantidad: number;
    vencimiento: string;
    estado: LoteEstado;
}

const almacenData: AlmacenItem[] = [
    {
        id: "A-1",
        almacen: "Central",
        medicamento: "Paracetamol 500mg",
        lote: "L-2389",
        cantidad: 300,
        vencimiento: "2026-02-15",
        estado: "Vigente",
    },
    {
        id: "A-2",
        almacen: "Central",
        medicamento: "Amoxicilina 500mg",
        lote: "A-5521",
        cantidad: 80,
        vencimiento: "2025-12-05",
        estado: "Proximo",
    },
    {
        id: "A-3",
        almacen: "Norte",
        medicamento: "Salbutamol",
        lote: "S-7410",
        cantidad: 40,
        vencimiento: "2025-11-10",
        estado: "Vencido",
    },
];

const loteStyles: Record<LoteEstado, string> = {
    Vigente: "bg-success-light text-success",
    Proximo: "bg-warning-light text-warning",
    Vencido: "bg-danger-light text-danger",
};

export function InventarioAlmacen() {
    const navigate = useNavigate();
    const [almacen, setAlmacen] = useState("");

    const filtered = useMemo(() => {
        return almacenData.filter((item) => (almacen ? item.almacen === almacen : true));
    }, [almacen]);

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
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">Inventario por almacen</h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Consulta el stock real por almacen y estado de lote.
                </p>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-white px-6 py-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Almacen
                                </span>
                                <select
                                    value={almacen}
                                    onChange={(e) => setAlmacen(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Todos</option>
                                    <option value="Central">Central</option>
                                    <option value="Norte">Norte</option>
                                    <option value="Sur">Sur</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[1fr_1.6fr_1fr_1fr_1fr_1fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Almacen</span>
                            <span>Medicamento</span>
                            <span>Lote</span>
                            <span>Cantidad</span>
                            <span>Vencimiento</span>
                            <span>Estado del lote</span>
                        </div>

                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-[1fr_1.6fr_1fr_1fr_1fr_1fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <span>{item.almacen}</span>
                                <span className="font-medium">{item.medicamento}</span>
                                <span>{item.lote}</span>
                                <span>{item.cantidad}</span>
                                <span>{item.vencimiento}</span>
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${loteStyles[item.estado]}`}
                                >
                                    {item.estado}
                                </span>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No se encontraron registros
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
