import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { medicamentoService, flattenStockFromLotes, type Medicamento, type StockPorAlmacen } from "@/services/medicamentoService";

type LoteEstado = "Vigente" | "Proximo" | "Vencido";

function getLoteEstado(fechaVencimiento?: string): LoteEstado {
    if (!fechaVencimiento) return "Vigente";
    const now = new Date();
    const venc = new Date(fechaVencimiento);
    if (venc < now) return "Vencido";
    const diff = venc.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days <= 90) return "Proximo";
    return "Vigente";
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-DO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const loteStyles: Record<LoteEstado, string> = {
    Vigente: "bg-success-light text-success",
    Proximo: "bg-warning-light text-warning",
    Vencido: "bg-danger-light text-danger",
};

export function DetalleInventario() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [medicamento, setMedicamento] = useState<Medicamento | null>(null);
    const [stock, setStock] = useState<StockPorAlmacen[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await medicamentoService.getMedicamentoById(decodeURIComponent(id));
            setMedicamento(data);
            setStock(flattenStockFromLotes(data.lote));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar medicamento");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-donamed-primary" />
            </div>
        );
    }

    if (error || !medicamento) {
        return (
            <div className="space-y-4">
                <button type="button" onClick={() => navigate("/inventario")} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]">
                    <ArrowLeft className="h-4 w-4" /> Volver a inventario
                </button>
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error ?? "Medicamento no encontrado"}
                </div>
            </div>
        );
    }

    const categorias = medicamento.categoria_medicamento
        ?.map((cm) => cm.categoria?.nombre)
        .filter(Boolean)
        .join(", ");

    const enfermedades = medicamento.enfermedad_medicamento
        ?.map((em) => em.enfermedad?.nombre)
        .filter(Boolean)
        .join(", ");

    const totalStock = stock.reduce((a, s) => a + s.cantidad, 0);

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/inventario")}
                    className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver a inventario
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    {medicamento.nombre}
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Detalle de inventario, lotes y almacenes asociados.
                </p>
            </div>

            {/* Información del medicamento */}
            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <h2 className="text-base font-semibold text-[#1E1E1E]">Información del medicamento</h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Código</span>
                            <span className="font-mono text-[#2D3748]">{medicamento.codigomedicamento}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Nombre</span>
                            <span className="text-[#2D3748]">{medicamento.nombre}</span>
                        </div>
                        {medicamento.compuesto_principal && (
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Compuesto principal</span>
                                <span className="text-[#2D3748]">{medicamento.compuesto_principal}</span>
                            </div>
                        )}
                        {medicamento.via_administracion && (
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Vía de administración</span>
                                <span className="text-[#2D3748]">{medicamento.via_administracion.nombre}</span>
                            </div>
                        )}
                        {medicamento.forma_farmaceutica && (
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Forma farmacéutica</span>
                                <span className="text-[#2D3748]">{medicamento.forma_farmaceutica.nombre}</span>
                            </div>
                        )}
                        {categorias && (
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Categorías</span>
                                <span className="text-[#2D3748]">{categorias}</span>
                            </div>
                        )}
                        {enfermedades && (
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Enfermedades</span>
                                <span className="text-[#2D3748]">{enfermedades}</span>
                            </div>
                        )}
                        {medicamento.estado && (
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Estado</span>
                                <span className={`w-fit rounded-full px-3 py-0.5 text-xs font-semibold ${medicamento.estado === "ACTIVO" ? "bg-success-light text-success" : "bg-danger-light text-danger"}`}>
                                    {medicamento.estado}
                                </span>
                            </div>
                        )}
                    </div>
                    {medicamento.descripcion && (
                        <div className="mt-4 flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Descripción</span>
                            <span className="text-[#2D3748]">{medicamento.descripcion}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Resumen */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Stock total</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">{totalStock}</p>
                    </CardContent>
                </Card>
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Lotes</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">{medicamento.lote?.length ?? 0}</p>
                    </CardContent>
                </Card>
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Almacenes</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">
                            {new Set(stock.map((s) => s.idalmacen)).size}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabla de stock por almacén */}
            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">
                            Stock por almacén y lote
                        </h2>
                        <p className="text-sm text-[#5B5B5B]/70">
                            Cantidades y vencimientos de cada lote distribuido en almacenes.
                        </p>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[650px]">
                            <div className="grid grid-cols-[1.2fr_1fr_0.7fr_0.8fr_0.7fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                <span>Almacén</span>
                                <span>Lote</span>
                                <span>Cantidad</span>
                                <span>Vencimiento</span>
                                <span>Estado</span>
                            </div>

                            {stock.length > 0 ? (
                                stock.map((s) => {
                                    const estado = getLoteEstado(s.fechavencimiento);
                                    return (
                                        <div
                                            key={`${s.idalmacen}-${s.codigolote}`}
                                            className="grid grid-cols-[1.2fr_1fr_0.7fr_0.8fr_0.7fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                        >
                                            <span>{s.nombreAlmacen}</span>
                                            <span className="font-mono text-xs">{s.codigolote}</span>
                                            <span className="font-medium">{s.cantidad}</span>
                                            <span className="text-xs">{formatDate(s.fechavencimiento)}</span>
                                            <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${loteStyles[estado]}`}>
                                                {estado}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-16 text-center text-sm text-[#5B5B5B]/60">
                                    Este medicamento no tiene stock en almacenes
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
