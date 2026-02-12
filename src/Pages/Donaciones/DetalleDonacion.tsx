import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { donacionService } from "@/services/donacionService";
import type { Donacion } from "@/services/donacionService";

function formatDate(dateStr: string): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function DetalleDonacion() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [donacion, setDonacion] = useState<Donacion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const num = parseInt(id, 10);
        if (isNaN(num)) {
            setError("ID inválido");
            setIsLoading(false);
            return;
        }
        donacionService
            .getDonacionById(num)
            .then(setDonacion)
            .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar"))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-donamed-light border-t-donamed-primary" />
                    <p className="text-sm text-[#5B5B5B]">Cargando donación...</p>
                </div>
            </div>
        );
    }

    if (error || !donacion) {
        return (
            <div className="space-y-6">
                <button
                    type="button"
                    onClick={() => navigate("/donaciones")}
                    className="inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a donaciones
                </button>
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error ?? "Donación no encontrada"}
                </div>
            </div>
        );
    }

    const proveedorNombre =
        donacion.proveedor_donaciones_proveedorToproveedor?.nombre ?? donacion.proveedor ?? "—";
    const totalUnidades =
        donacion.donacion_medicamento?.reduce((sum, m) => sum + m.cantidad, 0) ?? 0;

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
                        Información y medicamentos donados.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                >
                    <Link to={`/donaciones/${donacion.numerodonacion}/editar`}>
                        Editar donación
                    </Link>
                </Button>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Número de donación
                            </p>
                            <p className="mt-1 text-lg font-semibold text-[#1E1E1E]">
                                #{donacion.numerodonacion}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Proveedor / Donante
                            </span>
                            <span className="text-[#2D3748]">{proveedorNombre}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Fecha recibida
                            </span>
                            <span className="text-[#2D3748]">
                                {formatDate(donacion.fecha_recibida)}
                            </span>
                        </div>
                        {donacion.descripcion && (
                            <div className="flex flex-col gap-1 text-sm md:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Descripción
                                </span>
                                <span className="text-[#2D3748]">{donacion.descripcion}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            Total de ítems
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">
                            {donacion.donacion_medicamento?.length ?? 0}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            Total de unidades
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">
                            {totalUnidades}
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
                            Detalle de medicamentos por almacén.
                        </p>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[1.3fr_0.9fr_0.9fr_0.7fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Medicamento / Lote</span>
                            <span>Almacén</span>
                            <span>Lote</span>
                            <span>Cantidad</span>
                        </div>

                        {donacion.donacion_medicamento?.map((med, idx) => (
                            <div
                                key={`${med.idalmacen}-${med.codigolote}-${idx}`}
                                className="grid grid-cols-[1.3fr_0.9fr_0.9fr_0.7fr] gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <span className="font-medium">
                                    {med.lote?.medicamento?.nombre ?? med.codigolote}
                                </span>
                                <span>{med.almacen?.nombre ?? med.idalmacen}</span>
                                <span>{med.codigolote}</span>
                                <span>{med.cantidad}</span>
                            </div>
                        ))}

                        {(!donacion.donacion_medicamento ||
                            donacion.donacion_medicamento.length === 0) && (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No hay medicamentos en esta donación
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
