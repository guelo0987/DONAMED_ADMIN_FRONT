import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, User, Truck, Calendar, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { despachoService, type Despacho } from "@/services/despachoService";

function formatDateTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-DO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-DO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                {label}
            </span>
            <span className="text-[#2D3748]">{value || "—"}</span>
        </div>
    );
}

export function DetalleDespacho() {
    const navigate = useNavigate();
    const { id } = useParams();
    const numerodespacho = id ? parseInt(id, 10) : null;

    const [despacho, setDespacho] = useState<Despacho | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDespacho = useCallback(async () => {
        if (!numerodespacho) {
            setError("Número de despacho no válido");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const data = await despachoService.getDespachoById(numerodespacho);
            setDespacho(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar el despacho");
        } finally {
            setIsLoading(false);
        }
    }, [numerodespacho]);

    useEffect(() => {
        fetchDespacho();
    }, [fetchDespacho]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-donamed-primary" />
            </div>
        );
    }

    if (error || !despacho) {
        return (
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => navigate("/despachos/historial")}
                    className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver a historial
                </button>
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error ?? "Despacho no encontrado"}
                </div>
            </div>
        );
    }

    const sol = despacho.solicitud_despacho_solicitudTosolicitud;
    const receptor = despacho.persona;
    const solicitante = sol?.usuario?.persona;

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/despachos/historial")}
                    className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver a historial
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Detalle de Despacho
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Despacho #{despacho.numerodespacho}
                </p>
            </div>

            {/* Despacho Info */}
            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Truck className="h-5 w-5 text-donamed-primary" />
                        <h2 className="text-base font-semibold text-[#1E1E1E]">
                            Datos del despacho
                        </h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <InfoField label="N° Despacho" value={despacho.numerodespacho} />
                        <InfoField label="N° Solicitud" value={sol ? `S-${sol.numerosolicitud}` : `S-${despacho.solicitud}`} />
                        <InfoField label="Fecha de despacho" value={formatDateTime(despacho.fecha_despacho)} />
                        <InfoField label="Cédula recibe" value={despacho.cedula_recibe} />
                    </div>
                </CardContent>
            </Card>

            {/* Solicitud info */}
            {sol && (
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-donamed-primary" />
                            <h2 className="text-base font-semibold text-[#1E1E1E]">
                                Información de la solicitud
                            </h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <InfoField
                                label="Solicitante"
                                value={
                                    solicitante
                                        ? `${solicitante.nombre} ${solicitante.apellidos}`
                                        : sol.usuario?.correo ?? "—"
                                }
                            />
                            <InfoField label="Centro médico" value={sol.centromedico} />
                            <InfoField label="Patología" value={sol.patologia} />
                            <InfoField
                                label="Tipo de solicitud"
                                value={sol.tipo_solicitud?.descripcion ?? sol.codigotiposolicitud}
                            />
                            <InfoField label="Estado" value={sol.estado} />
                            <InfoField label="Representante" value={sol.cedularepresentante} />
                            <InfoField label="Fecha solicitud" value={formatDate(sol.creada_en)} />
                            <InfoField label="Última actualización" value={formatDateTime(sol.actualizado_en)} />
                        </div>
                        {sol.observaciones && (
                            <div className="mt-4">
                                <InfoField label="Observaciones" value={sol.observaciones} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Receptor info */}
            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="h-5 w-5 text-donamed-primary" />
                        <h2 className="text-base font-semibold text-[#1E1E1E]">
                            Persona que recibió
                        </h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <InfoField label="Cédula" value={despacho.cedula_recibe} />
                        <InfoField
                            label="Nombre"
                            value={receptor ? `${receptor.nombre} ${receptor.apellidos}` : "—"}
                        />
                        <InfoField label="Teléfono" value={receptor?.telefono} />
                    </div>
                </CardContent>
            </Card>

            {/* Medicamentos solicitados */}
            {sol?.medicamento_solicitado && sol.medicamento_solicitado.length > 0 && (
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-0">
                        <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                            <h2 className="text-base font-semibold text-[#1E1E1E]">
                                Medicamentos solicitados
                            </h2>
                            <p className="text-sm text-[#5B5B5B]/70">
                                Medicamentos que el paciente solicitó (texto libre).
                            </p>
                        </div>
                        <div className="w-full">
                            <div className="grid grid-cols-[0.3fr_1.6fr_1fr_1fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                <span>#</span>
                                <span>Medicamento</span>
                                <span>Dosis</span>
                                <span>Fecha</span>
                            </div>
                            {sol.medicamento_solicitado.map((med, idx) => (
                                <div
                                    key={med.id}
                                    className="grid grid-cols-[0.3fr_1.6fr_1fr_1fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                >
                                    <span className="text-xs text-[#8B9096]">{idx + 1}</span>
                                    <span className="font-medium">{med.nombre}</span>
                                    <span className="text-xs">{med.dosis || "—"}</span>
                                    <span className="text-xs">{formatDate(med.creado_en)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Detalle solicitud (lotes/almacenes) */}
            {sol?.detalle_solicitud && sol.detalle_solicitud.length > 0 && (
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-0">
                        <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-donamed-primary" />
                                <h2 className="text-base font-semibold text-[#1E1E1E]">
                                    Detalle de despacho (Lotes del inventario)
                                </h2>
                            </div>
                            <p className="mt-1 text-sm text-[#5B5B5B]/70">
                                Medicamentos asignados del inventario real (lote, almacén, dosis).
                            </p>
                        </div>
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[750px]">
                                <div className="grid grid-cols-[1.2fr_0.7fr_0.6fr_1fr_1fr_0.8fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    <span>Medicamento</span>
                                    <span>Lote</span>
                                    <span>Cantidad</span>
                                    <span>Dosis indicada</span>
                                    <span>Tiempo tratamiento</span>
                                    <span>Almacén</span>
                                </div>
                                {sol.detalle_solicitud.map((det, idx) => (
                                    <div
                                        key={`${det.codigolote}-${det.idalmacen}-${idx}`}
                                        className="grid grid-cols-[1.2fr_0.7fr_0.6fr_1fr_1fr_0.8fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                    >
                                        <span className="font-medium">
                                            {det.lote?.medicamento?.nombre ?? "—"}
                                        </span>
                                        <span className="text-xs">{det.codigolote}</span>
                                        <span>{det.cantidad}</span>
                                        <span className="text-xs">{det.dosis_indicada || "—"}</span>
                                        <span className="text-xs">{det.tiempo_tratamiento || "—"}</span>
                                        <span className="text-xs">
                                            {det.almacen?.nombre ?? `#${det.idalmacen}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
