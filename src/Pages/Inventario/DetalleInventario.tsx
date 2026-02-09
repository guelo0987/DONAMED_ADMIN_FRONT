import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

type LoteEstado = "Vigente" | "Proximo" | "Vencido";

interface DetalleItem {
    id: string;
    medicamento: string;
    categoria: string;
    almacenPrincipal: string;
    codigoDonacion: string;
    almacenInfo: {
        nombre: string;
        telefono: string;
        correo: string;
        ciudad: string;
        direccion: string;
        estado: string;
    };
    lotes: Array<{
        id: string;
        almacen: string;
        lote: string;
        cantidad: number;
        vencimiento: string;
        estado: LoteEstado;
    }>;
}

const detalleMock: DetalleItem = {
    id: "med-1",
    medicamento: "Paracetamol 500mg",
    categoria: "Analgesico",
    almacenPrincipal: "Central",
    codigoDonacion: "D-24589",
    almacenInfo: {
        nombre: "Almacen Central",
        telefono: "+57 300 555 0123",
        correo: "central@donamed.com",
        ciudad: "Bogota",
        direccion: "Calle 72 #10-45",
        estado: "Activo",
    },
    lotes: [
        {
            id: "L-2389",
            almacen: "Central",
            lote: "L-2389",
            cantidad: 300,
            vencimiento: "2026-02-15",
            estado: "Vigente",
        },
        {
            id: "L-3011",
            almacen: "Norte",
            lote: "L-3011",
            cantidad: 120,
            vencimiento: "2025-12-01",
            estado: "Proximo",
        },
    ],
};

const loteStyles: Record<LoteEstado, string> = {
    Vigente: "bg-success-light text-success",
    Proximo: "bg-warning-light text-warning",
    Vencido: "bg-danger-light text-danger",
};

export function DetalleInventario() {
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
                    onClick={() => navigate("/inventario")}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a inventario
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Detalle de Inventario
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Lotes disponibles y almacen asociados al medicamento.
                </p>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Medicamento
                            </span>
                            <span className="text-[#2D3748]">{detalle.medicamento}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Categoria
                            </span>
                            <span className="text-[#2D3748]">{detalle.categoria}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Almacen
                            </span>
                            <span className="text-[#2D3748]">{detalle.almacenPrincipal}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Codigo de donacion
                            </span>
                            <span className="text-[#2D3748]">{detalle.codigoDonacion}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <h2 className="text-base font-semibold text-[#1E1E1E]">
                        Informacion del almacen
                    </h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Nombre
                            </span>
                            <span className="text-[#2D3748]">{detalle.almacenInfo.nombre}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Telefono
                            </span>
                            <span className="text-[#2D3748]">{detalle.almacenInfo.telefono}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Correo
                            </span>
                            <span className="text-[#2D3748]">{detalle.almacenInfo.correo}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Ciudad
                            </span>
                            <span className="text-[#2D3748]">{detalle.almacenInfo.ciudad}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Direccion
                            </span>
                            <span className="text-[#2D3748]">{detalle.almacenInfo.direccion}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Estado
                            </span>
                            <span className="text-[#2D3748]">{detalle.almacenInfo.estado}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">
                            Lotes por almacen
                        </h2>
                        <p className="text-sm text-[#5B5B5B]/70">
                            Consulta cantidades y vencimientos por almacen.
                        </p>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Almacen</span>
                            <span>Lote</span>
                            <span>Cantidad</span>
                            <span>Vencimiento</span>
                            <span>Estado</span>
                        </div>

                        {detalle.lotes.map((lote) => (
                            <div
                                key={lote.id}
                                className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <span>{lote.almacen}</span>
                                <span>{lote.lote}</span>
                                <span>{lote.cantidad}</span>
                                <span>{lote.vencimiento}</span>
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${loteStyles[lote.estado]}`}
                                >
                                    {lote.estado}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
