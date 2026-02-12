import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EstadoMedicamento = "ACTIVO" | "INACTIVO" | "ELIMINADO";

interface StockAlmacen {
    idalmacen: number;
    nombreAlmacen: string;
    codigolote: string;
    cantidad: number;
}

interface MedicamentoDetalle {
    codigomedicamento: string;
    nombre: string;
    descripcion: string | null;
    compuesto_principal: string;
    idforma_farmaceutica: number;
    idvia_administracion: number;
    cantidad_disponible_global: number;
    estado: EstadoMedicamento;
    creado_en: string;
    actualizado_en: string;
    foto_url: string | null;
    formaFarmaceutica?: string;
    viaAdministracion?: string;
    categorias?: string[];
    stockPorAlmacen?: StockAlmacen[];
}

const detalleMock: MedicamentoDetalle = {
    codigomedicamento: "MED-001",
    nombre: "Metformina 500mg",
    descripcion:
        "Antidiabético oral del grupo de las biguanidas. Indicado para el tratamiento de la diabetes mellitus tipo 2, especialmente en pacientes con sobrepeso.",
    compuesto_principal: "Metformina clorhidrato",
    idforma_farmaceutica: 1,
    idvia_administracion: 1,
    cantidad_disponible_global: 450,
    estado: "ACTIVO",
    creado_en: "2024-01-15T10:00:00",
    actualizado_en: "2025-02-10T14:30:00",
    foto_url: null,
    formaFarmaceutica: "Tableta",
    viaAdministracion: "Oral",
    categorias: ["Antidiabéticos", "Biguanidas"],
    stockPorAlmacen: [
        { idalmacen: 1, nombreAlmacen: "Almacén Central", codigolote: "L-2024-001", cantidad: 280 },
        { idalmacen: 2, nombreAlmacen: "Almacén Norte", codigolote: "L-2024-002", cantidad: 120 },
        { idalmacen: 3, nombreAlmacen: "Almacén Sur", codigolote: "L-2024-015", cantidad: 50 },
    ],
};

const statusStyles: Record<EstadoMedicamento, string> = {
    ACTIVO: "bg-success-light text-success",
    INACTIVO: "bg-warning-light text-warning",
    ELIMINADO: "bg-danger-light text-danger",
};

const estadoLabels: Record<EstadoMedicamento, string> = {
    ACTIVO: "Activo",
    INACTIVO: "Inactivo",
    ELIMINADO: "Eliminado",
};

function formatDateTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function DetalleMedicamento() {
    const navigate = useNavigate();
    const { id } = useParams();

    const medicamento = useMemo(() => {
        return id ? { ...detalleMock, codigomedicamento: id } : detalleMock;
    }, [id]);

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
                        <Link to={`/inventario/medicamento/${medicamento.codigomedicamento}`}>
                            Ver en inventario
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="h-10 rounded-xl border-2 border-donamed-primary text-donamed-primary"
                    >
                        <Link to={`/medicamentos/${medicamento.codigomedicamento}/editar`}>
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
                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[medicamento.estado]}`}
                        >
                            {estadoLabels[medicamento.estado]}
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
                            <span className="text-[#2D3748]">{medicamento.compuesto_principal}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Forma farmacéutica
                            </span>
                            <span className="text-[#2D3748]">
                                {medicamento.formaFarmaceutica ?? "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Vía de administración
                            </span>
                            <span className="text-[#2D3748]">
                                {medicamento.viaAdministracion ?? "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Stock global disponible
                            </span>
                            <span
                                className={`text-lg font-semibold ${medicamento.cantidad_disponible_global < 100 ? "text-warning" : "text-[#2D3748]"}`}
                            >
                                {medicamento.cantidad_disponible_global} unidades
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Fecha de creación
                            </span>
                            <span className="text-[#2D3748]">
                                {formatDateTime(medicamento.creado_en)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Última actualización
                            </span>
                            <span className="text-[#2D3748]">
                                {formatDateTime(medicamento.actualizado_en)}
                            </span>
                        </div>
                        {medicamento.descripcion && (
                            <div className="flex flex-col gap-1 text-sm md:col-span-3">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Descripción
                                </span>
                                <span className="text-[#2D3748]">{medicamento.descripcion}</span>
                            </div>
                        )}
                        {medicamento.categorias && medicamento.categorias.length > 0 && (
                            <div className="flex flex-col gap-1 text-sm md:col-span-3">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Categorías (categoria_medicamento)
                                </span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {medicamento.categorias.map((cat) => (
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
                    </div>
                </CardContent>
            </Card>

            {/* Stock por almacén (almacen_medicamento) */}
            {medicamento.stockPorAlmacen && medicamento.stockPorAlmacen.length > 0 && (
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-0">
                        <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                            <h2 className="text-base font-semibold text-[#1E1E1E]">
                                Stock por almacén
                            </h2>
                            <p className="text-sm text-[#5B5B5B]/70">
                                Distribución según tabla almacen_medicamento (idalmacen, codigolote, cantidad).
                            </p>
                        </div>

                        <div className="w-full">
                            <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                <span>Almacén</span>
                                <span>Lote</span>
                                <span>Cantidad</span>
                            </div>

                            {medicamento.stockPorAlmacen.map((s) => (
                                <div
                                    key={`${s.idalmacen}-${s.codigolote}`}
                                    className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                >
                                    <span className="font-medium">{s.nombreAlmacen}</span>
                                    <span>{s.codigolote}</span>
                                    <span>{s.cantidad}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
