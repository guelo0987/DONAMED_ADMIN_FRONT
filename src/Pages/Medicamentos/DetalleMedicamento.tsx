import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    medicamentoService,
    flattenStockFromLotes,
} from "@/services/medicamentoService";
import type { Medicamento, StockPorAlmacen } from "@/services/medicamentoService";

type EstadoMedicamento = "ACTIVO" | "INACTIVO";

const statusStyles: Record<EstadoMedicamento, string> = {
    ACTIVO: "bg-success-light text-success",
    INACTIVO: "bg-warning-light text-warning",
};

const estadoLabels: Record<EstadoMedicamento, string> = {
    ACTIVO: "Activo",
    INACTIVO: "Inactivo",
};

function formatDateTime(dateStr: string | null | undefined): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function DetalleMedicamento() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [medicamento, setMedicamento] = useState<Medicamento | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const codigo = decodeURIComponent(id);
        medicamentoService
            .getMedicamentoById(codigo)
            .then(setMedicamento)
            .catch((err) =>
                setError(err instanceof Error ? err.message : "Error al cargar")
            )
            .finally(() => setIsLoading(false));
    }, [id]);

    const stockPorAlmacen: StockPorAlmacen[] = useMemo(
        () => flattenStockFromLotes(medicamento?.lote),
        [medicamento?.lote]
    );

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-donamed-light border-t-donamed-primary" />
                    <p className="text-sm text-[#5B5B5B]">Cargando medicamento...</p>
                </div>
            </div>
        );
    }

    if (error || !medicamento) {
        return (
            <div className="space-y-6">
                <button
                    type="button"
                    onClick={() => navigate("/medicamentos")}
                    className="inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a medicamentos
                </button>
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error ?? "Medicamento no encontrado"}
                </div>
            </div>
        );
    }

    const estado = (medicamento.estado as EstadoMedicamento) || "ACTIVO";
    const stockGlobal = medicamento.cantidad_disponible_global ?? 0;
    const categorias: string[] =
        medicamento.categoria_medicamento
            ?.map((c) => c.categoria?.nombre)
            .filter((n): n is string => Boolean(n)) ?? [];
    const enfermedades: string[] =
        medicamento.enfermedad_medicamento
            ?.map((e) => e.enfermedad?.nombre)
            .filter((n): n is string => Boolean(n)) ?? [];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/medicamentos")}
                        className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                    >
                        ← Volver a medicamentos
                    </button>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                        Detalle de Medicamento
                    </h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Información completa del medicamento según catálogo.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        asChild
                        className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                    >
                        <Link
                            to={`/inventario/medicamento/${encodeURIComponent(medicamento.codigomedicamento)}`}
                        >
                            Ver en inventario
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="h-10 rounded-xl border-2 border-donamed-primary text-donamed-primary"
                    >
                        <Link
                            to={`/medicamentos/${encodeURIComponent(medicamento.codigomedicamento)}/editar`}
                        >
                            Editar
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Código de medicamento
                            </p>
                            <p className="mt-1 text-lg font-semibold text-[#1E1E1E]">
                                {medicamento.codigomedicamento}
                            </p>
                        </div>
                        <span
                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[estado]}`}
                        >
                            {estadoLabels[estado]}
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-1 text-sm md:col-span-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Nombre
                            </span>
                            <span className="text-[#2D3748]">{medicamento.nombre}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Compuesto principal
                            </span>
                            <span className="text-[#2D3748]">
                                {medicamento.compuesto_principal ?? "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Forma farmacéutica
                            </span>
                            <span className="text-[#2D3748]">
                                {medicamento.forma_farmaceutica?.nombre ?? "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Vía de administración
                            </span>
                            <span className="text-[#2D3748]">
                                {medicamento.via_administracion?.nombre ?? "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Stock global disponible
                            </span>
                            <span
                                className={`text-lg font-semibold ${stockGlobal < 100 ? "text-warning" : "text-[#2D3748]"}`}
                            >
                                {stockGlobal} unidades
                            </span>
                        </div>
                        {medicamento.creado_en && (
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Fecha de creación
                                </span>
                                <span className="text-[#2D3748]">
                                    {formatDateTime(medicamento.creado_en)}
                                </span>
                            </div>
                        )}
                        {medicamento.actualizado_en && (
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Última actualización
                                </span>
                                <span className="text-[#2D3748]">
                                    {formatDateTime(medicamento.actualizado_en)}
                                </span>
                            </div>
                        )}
                        {medicamento.descripcion && (
                            <div className="flex flex-col gap-1 text-sm md:col-span-3">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Descripción
                                </span>
                                <span className="text-[#2D3748]">{medicamento.descripcion}</span>
                            </div>
                        )}
                        {categorias.length > 0 && (
                            <div className="flex flex-col gap-1 text-sm md:col-span-3">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Categorías (categoria_medicamento)
                                </span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {categorias.map((cat) => (
                                        <span
                                            key={cat}
                                            className="rounded-full bg-donamed-light px-3 py-1 text-xs font-medium text-donamed-dark"
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {enfermedades.length > 0 && (
                            <div className="flex flex-col gap-1 text-sm md:col-span-3">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Enfermedades (enfermedad_medicamento)
                                </span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {enfermedades.map((enf) => (
                                        <span
                                            key={enf}
                                            className="rounded-full bg-donamed-light px-3 py-1 text-xs font-medium text-donamed-dark"
                                        >
                                            {enf}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Stock por almacén (lote[] -> almacen_medicamento[] aplanado) */}
            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">
                            Stock por almacén
                        </h2>
                        <p className="text-sm text-[#5B5B5B]/70">
                            Distribución según tabla almacen_medicamento (idalmacen, codigolote,
                            cantidad).
                        </p>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Almacén</span>
                            <span>Lote</span>
                            <span>Vencimiento</span>
                            <span>Cantidad</span>
                        </div>

                        {stockPorAlmacen.length > 0 ? (
                            stockPorAlmacen.map((s) => (
                                <div
                                    key={`${s.idalmacen}-${s.codigolote}`}
                                    className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                >
                                    <span className="font-medium">{s.nombreAlmacen}</span>
                                    <span>{s.codigolote}</span>
                                    <span>{formatDate(s.fechavencimiento)}</span>
                                    <span>{s.cantidad}</span>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No hay stock registrado por almacén
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
