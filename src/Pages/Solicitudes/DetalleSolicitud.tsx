import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    FileText, Download, ExternalLink, Image as ImageIcon, File, Plus, Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { solicitudService } from "@/services/solicitudService";
import { inventarioService, type InventarioItem } from "@/services/inventarioService";
import { useToast } from "@/contexts/ToastContext";
import type {
    Solicitud, EstadoSolicitud, MedicamentoSolicitado, DocumentoSolicitud,
} from "@/types/solicitud.types";

const ALL_ESTADOS: EstadoSolicitud[] = [
    "PENDIENTE", "EN_REVISION", "APROBADA", "RECHAZADA", "INCOMPLETA", "DESPACHADA", "CANCELADA",
];

const statusStyles: Record<EstadoSolicitud, string> = {
    PENDIENTE: "bg-warning-light text-warning",
    APROBADA: "bg-success-light text-success",
    RECHAZADA: "bg-danger-light text-danger",
    DESPACHADA: "bg-donamed-light text-donamed-dark",
    EN_REVISION: "bg-pending-light text-pending",
    CANCELADA: "bg-danger-light text-danger",
    INCOMPLETA: "bg-warning-light text-warning",
};

const estadoLabels: Record<EstadoSolicitud, string> = {
    PENDIENTE: "Pendiente",
    APROBADA: "Aprobada",
    RECHAZADA: "Rechazada",
    DESPACHADA: "Despachada",
    EN_REVISION: "En revisión",
    CANCELADA: "Cancelada",
    INCOMPLETA: "Incompleta",
};

function formatDateTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleString("es-DO", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
}

function getSolicitanteNombre(solicitud: Solicitud): string {
    const persona = solicitud.usuario?.persona;
    if (persona) return `${persona.nombre} ${persona.apellidos}`;
    return solicitud.usuario?.correo ?? "—";
}

function parseDocumentos(raw: unknown): DocumentoSolicitud[] {
    if (!raw) return [];
    if (Array.isArray(raw)) {
        return raw.map((item) => {
            if (typeof item === "string") {
                const name = item.split("/").pop() ?? item;
                return { nombre: name, url: item };
            }
            if (typeof item === "object" && item !== null) {
                const obj = item as Record<string, unknown>;
                return {
                    nombre: (obj.nombre ?? obj.name ?? obj.fileName ?? obj.key ?? "Documento") as string,
                    url: (obj.url ?? obj.uri ?? obj.path ?? obj.link ?? "") as string,
                    tipo: (obj.tipo ?? obj.type ?? obj.mimeType ?? "") as string,
                };
            }
            return { nombre: String(item) };
        });
    }
    if (typeof raw === "string") {
        try {
            const parsed = JSON.parse(raw);
            return parseDocumentos(parsed);
        } catch {
            return [{ nombre: raw, url: raw }];
        }
    }
    if (typeof raw === "object") {
        return [raw as DocumentoSolicitud];
    }
    return [];
}

function getFileIcon(doc: DocumentoSolicitud) {
    const ext = (doc.nombre ?? doc.url ?? "").toLowerCase();
    const tipo = (doc.tipo ?? "").toLowerCase();
    if (tipo.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(ext)) {
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
    }
    if (/\.pdf$/i.test(ext) || tipo === "application/pdf") {
        return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <File className="h-5 w-5 text-[#8B9096]" />;
}

// ---- Tipo para fila del formulario de asignación ----
interface DetalleRow {
    key: number;
    inventarioKey: string; // "idalmacen-codigolote"
    cantidad: number;
    dosis_indicada: string;
    tiempo_tratamiento: string;
}

export function DetalleSolicitud() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addToast } = useToast();

    const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
    const [medicamentosSolicitados, setMedicamentosSolicitados] = useState<MedicamentoSolicitado[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal estado
    const [showEstadoModal, setShowEstadoModal] = useState(false);
    const [selectedEstado, setSelectedEstado] = useState<EstadoSolicitud | "">("");
    const [observaciones, setObservaciones] = useState("");
    const [isUpdatingEstado, setIsUpdatingEstado] = useState(false);

    // Asignar detalles (inventario)
    const [inventario, setInventario] = useState<InventarioItem[]>([]);
    const [isLoadingInventario, setIsLoadingInventario] = useState(false);
    const [detalleRows, setDetalleRows] = useState<DetalleRow[]>([]);
    const [rowKeyCounter, setRowKeyCounter] = useState(0);
    const [isSavingDetalles, setIsSavingDetalles] = useState(false);
    const [isDeletingDetalles, setIsDeletingDetalles] = useState(false);

    const numSolicitud = id ? parseInt(id, 10) : NaN;

    const fetchSolicitud = useCallback(async () => {
        if (isNaN(numSolicitud)) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await solicitudService.getSolicitudById(numSolicitud);
            setSolicitud(data);
            setMedicamentosSolicitados(data.medicamento_solicitado ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar solicitud");
        } finally {
            setIsLoading(false);
        }
    }, [numSolicitud]);

    useEffect(() => {
        fetchSolicitud();
    }, [fetchSolicitud]);

    // Cargar inventario cuando la solicitud está EN_REVISION
    useEffect(() => {
        if (solicitud?.estado === "EN_REVISION") {
            setIsLoadingInventario(true);
            inventarioService
                .getInventario()
                .then((items) => {
                    setInventario(items.filter((i) => i.cantidad > 0));
                })
                .catch(() => {
                    /* silently ignore */
                })
                .finally(() => setIsLoadingInventario(false));
        }
    }, [solicitud?.estado]);

    const handleCambiarEstado = async () => {
        if (!solicitud || !selectedEstado) return;
        setIsUpdatingEstado(true);
        try {
            const updated = await solicitudService.updateSolicitudEstado(
                solicitud.numerosolicitud,
                { estado: selectedEstado, observaciones: observaciones.trim() || undefined }
            );
            setSolicitud(updated);
            setMedicamentosSolicitados(updated.medicamento_solicitado ?? medicamentosSolicitados);
            setShowEstadoModal(false);
            setSelectedEstado("");
            setObservaciones("");
            addToast({ variant: "success", title: "Estado actualizado", message: `La solicitud pasó a ${estadoLabels[selectedEstado]}.` });
        } catch (err) {
            addToast({ variant: "error", title: "Error", message: err instanceof Error ? err.message : "Error al actualizar estado." });
        } finally {
            setIsUpdatingEstado(false);
        }
    };

    // ---- Detalles form helpers ----
    const addDetalleRow = () => {
        const nextKey = rowKeyCounter + 1;
        setRowKeyCounter(nextKey);
        setDetalleRows((prev) => [
            ...prev,
            { key: nextKey, inventarioKey: "", cantidad: 1, dosis_indicada: "", tiempo_tratamiento: "" },
        ]);
    };

    const removeDetalleRow = (key: number) => {
        setDetalleRows((prev) => prev.filter((r) => r.key !== key));
    };

    const updateDetalleRow = (key: number, field: keyof DetalleRow, value: string | number) => {
        setDetalleRows((prev) =>
            prev.map((r) => (r.key === key ? { ...r, [field]: value } : r))
        );
    };

    const getInventarioLabel = (item: InventarioItem) => {
        const medName = item.medicamento?.nombre ?? item.codigomedicamento;
        const almName = item.almacen?.nombre ?? `Almacén #${item.idalmacen}`;
        const loteCode = item.codigolote;
        const venc = item.lote?.fechavencimiento
            ? new Date(item.lote.fechavencimiento).toLocaleDateString("es-DO")
            : "";
        return `${medName} — Lote: ${loteCode}${venc ? ` (Vence: ${venc})` : ""} — ${almName} — Stock: ${item.cantidad}`;
    };

    const handleGuardarDetalles = async () => {
        if (!solicitud) return;
        const validRows = detalleRows.filter((r) => r.inventarioKey && r.cantidad > 0 && r.dosis_indicada.trim() && r.tiempo_tratamiento.trim());
        if (validRows.length === 0) {
            addToast({ variant: "error", title: "Error", message: "Agrega al menos un medicamento con todos los campos completos." });
            return;
        }

        const detalles = validRows.map((r) => {
            const [idalmacen, codigolote] = r.inventarioKey.split("|");
            return {
                idalmacen: parseInt(idalmacen, 10),
                codigolote,
                cantidad: r.cantidad,
                dosis_indicada: r.dosis_indicada.trim(),
                tiempo_tratamiento: r.tiempo_tratamiento.trim(),
            };
        });

        setIsSavingDetalles(true);
        try {
            await solicitudService.asignarDetalles(solicitud.numerosolicitud, detalles);
            addToast({ variant: "success", title: "Medicamentos asignados", message: "Los medicamentos del inventario fueron asignados correctamente." });
            setDetalleRows([]);
            await fetchSolicitud();
        } catch (err) {
            addToast({ variant: "error", title: "Error", message: err instanceof Error ? err.message : "Error al asignar medicamentos." });
        } finally {
            setIsSavingDetalles(false);
        }
    };

    const handleEliminarDetalles = async () => {
        if (!solicitud) return;
        setIsDeletingDetalles(true);
        try {
            await solicitudService.eliminarDetalles(solicitud.numerosolicitud);
            addToast({ variant: "success", title: "Detalles eliminados", message: "Los medicamentos asignados fueron eliminados." });
            await fetchSolicitud();
        } catch (err) {
            addToast({ variant: "error", title: "Error", message: err instanceof Error ? err.message : "Error al eliminar detalles." });
        } finally {
            setIsDeletingDetalles(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-sm text-[#5B5B5B]/60">Cargando solicitud...</div>
            </div>
        );
    }

    if (error || !solicitud) {
        return (
            <div className="space-y-6">
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error ?? "Solicitud no encontrada"}
                </div>
                <Button variant="outline" onClick={() => navigate("/solicitudes")} className="rounded-xl">
                    Volver a solicitudes
                </Button>
            </div>
        );
    }

    const detalles = solicitud.detalle_solicitud ?? [];
    const despacho = solicitud.despacho_despacho_solicitudTosolicitud;
    const documentos = parseDocumentos(solicitud.documentos);
    const estadosDisponibles = ALL_ESTADOS.filter((e) => e !== solicitud.estado);
    const esEnRevision = solicitud.estado === "EN_REVISION";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/solicitudes")}
                        className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                    >
                        ← Volver a solicitudes
                    </button>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                        Solicitud S-{solicitud.numerosolicitud}
                    </h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Información completa de la solicitud de medicamentos.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        type="button"
                        onClick={() => { setShowEstadoModal(true); setSelectedEstado(""); setObservaciones(""); }}
                        className="h-10 rounded-xl border-2 border-[#34A4B3] bg-[#F3F3F3] px-5 text-sm font-semibold text-[#34A4B3] hover:bg-[#EDEDED]"
                        variant="outline"
                    >
                        Cambiar estado
                    </Button>
                    {solicitud.estado === "APROBADA" && (
                        <Button asChild className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark">
                            <Link to={`/despachos/${solicitud.numerosolicitud}`}>Crear despacho</Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Info principal */}
            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Número de solicitud</p>
                            <p className="mt-1 text-lg font-semibold text-[#1E1E1E]">S-{solicitud.numerosolicitud}</p>
                        </div>
                        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[solicitud.estado]}`}>
                            {estadoLabels[solicitud.estado]}
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <InfoField label="Solicitante" value={getSolicitanteNombre(solicitud)} />
                        <InfoField label="Correo" value={solicitud.usuario?.correo ?? "—"} />
                        <InfoField label="Centro médico" value={solicitud.centromedico || "—"} />
                        <InfoField label="Cédula representante" value={solicitud.cedularepresentante ?? "—"} />
                        {solicitud.persona && (
                            <InfoField
                                label="Representante"
                                value={`${solicitud.persona.nombre} ${solicitud.persona.apellidos}`}
                            />
                        )}
                        <InfoField label="Relación solicitante" value={solicitud.relacion_solicitante ?? "—"} />
                        <InfoField label="Patología" value={solicitud.patologia} />
                        <InfoField label="Tipo de solicitud" value={solicitud.tipo_solicitud?.descripcion ?? solicitud.codigotiposolicitud} />
                        <InfoField label="Fecha de creación" value={formatDateTime(solicitud.creada_en)} />
                        <InfoField label="Última actualización" value={formatDateTime(solicitud.actualizado_en)} />
                        {solicitud.observaciones && (
                            <div className="flex flex-col gap-1 text-sm md:col-span-2 lg:col-span-3">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Observaciones</span>
                                <span className="whitespace-pre-wrap text-[#2D3748]">{solicitud.observaciones}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Documentos */}
            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">Documentos adjuntos</h2>
                        <p className="text-sm text-[#5B5B5B]/70">
                            Documentos enviados por el solicitante.
                        </p>
                    </div>

                    {documentos.length === 0 ? (
                        <div className="px-6 py-10 text-center text-sm text-[#5B5B5B]/60">
                            No hay documentos adjuntos
                        </div>
                    ) : (
                        <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
                            {documentos.map((doc, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 rounded-xl border border-[#E7E7E7] bg-[#FBFBFC] px-4 py-3 transition hover:border-donamed-primary/30 hover:shadow-sm"
                                >
                                    {getFileIcon(doc)}
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium text-[#2D3748]">
                                            {doc.nombre || "Documento"}
                                        </p>
                                        {doc.tipo && (
                                            <p className="truncate text-xs text-[#8B9096]">{doc.tipo}</p>
                                        )}
                                    </div>
                                    {doc.url && (
                                        <div className="flex items-center gap-1">
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5B5B5B] transition hover:bg-donamed-light hover:text-donamed-dark"
                                                title="Abrir"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                            <a
                                                href={doc.url}
                                                download={doc.nombre}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5B5B5B] transition hover:bg-donamed-light hover:text-donamed-dark"
                                                title="Descargar"
                                            >
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Despacho info */}
            {despacho && (
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">Despacho</h2>
                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                            <InfoField label="N° Despacho" value={String(despacho.numerodespacho)} />
                            <InfoField label="Fecha despacho" value={formatDateTime(despacho.fecha_despacho)} />
                            <InfoField
                                label="Recibe"
                                value={
                                    despacho.persona
                                        ? `${despacho.persona.nombre} ${despacho.persona.apellidos}`
                                        : despacho.cedula_recibe
                                }
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Resumen */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Medicamentos solicitados</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">{medicamentosSolicitados.length}</p>
                    </CardContent>
                </Card>
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Documentos</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">{documentos.length}</p>
                    </CardContent>
                </Card>
                {detalles.length > 0 && (
                    <>
                        <Card className="border-[#EEF1F4]">
                            <CardContent className="p-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Med. asignados</p>
                                <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">{detalles.length}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-[#EEF1F4]">
                            <CardContent className="p-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Total unidades</p>
                                <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">{detalles.reduce((a, d) => a + d.cantidad, 0)}</p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Medicamentos Solicitados (read-only) */}
            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">Medicamentos solicitados</h2>
                        <p className="text-sm text-[#5B5B5B]/70">Medicamentos que el paciente solicitó.</p>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[0.4fr_2fr_1fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>ID</span>
                            <span>Nombre del medicamento</span>
                            <span>Fecha</span>
                        </div>

                        {medicamentosSolicitados.length === 0 ? (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No hay medicamentos solicitados
                            </div>
                        ) : (
                            medicamentosSolicitados.map((med) => (
                                <div
                                    key={med.id}
                                    className="grid grid-cols-[0.4fr_2fr_1fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                >
                                    <span className="font-medium">{med.id}</span>
                                    <span className="font-medium">{med.nombre}</span>
                                    <span className="text-xs text-[#5B5B5B]/70">{formatDateTime(med.creado_en)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Asignar medicamentos del inventario (solo EN_REVISION) */}
            {esEnRevision && (
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                            <div>
                                <h2 className="text-base font-semibold text-[#1E1E1E]">
                                    Asignar medicamentos del inventario
                                </h2>
                                <p className="text-sm text-[#5B5B5B]/70">
                                    Selecciona lotes reales del inventario para asignar a esta solicitud.
                                </p>
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                className="h-9 gap-1.5 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                                onClick={addDetalleRow}
                                disabled={isLoadingInventario}
                            >
                                <Plus className="h-4 w-4" />
                                Agregar fila
                            </Button>
                        </div>

                        {isLoadingInventario ? (
                            <div className="py-8 text-center text-sm text-[#5B5B5B]/60">
                                Cargando inventario...
                            </div>
                        ) : inventario.length === 0 ? (
                            <div className="py-8 text-center text-sm text-[#5B5B5B]/60">
                                No hay items con stock disponible en el inventario.
                            </div>
                        ) : (
                            <div className="p-6 space-y-4">
                                {detalleRows.length === 0 ? (
                                    <div className="py-6 text-center text-sm text-[#5B5B5B]/60">
                                        Haz clic en "Agregar fila" para asignar medicamentos del inventario.
                                    </div>
                                ) : (
                                    detalleRows.map((row) => {
                                        const selectedInv = inventario.find(
                                            (i) => `${i.idalmacen}|${i.codigolote}` === row.inventarioKey
                                        );
                                        return (
                                            <div
                                                key={row.key}
                                                className="rounded-xl border border-[#E7E7E7] bg-[#FBFBFC] p-4 space-y-3"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                                            Medicamento (Lote / Almacén / Stock)
                                                        </label>
                                                        <select
                                                            value={row.inventarioKey}
                                                            onChange={(e) => updateDetalleRow(row.key, "inventarioKey", e.target.value)}
                                                            className="mt-1 h-10 w-full rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                                        >
                                                            <option value="">Seleccionar del inventario...</option>
                                                            {inventario.map((item) => (
                                                                <option
                                                                    key={`${item.idalmacen}-${item.codigolote}`}
                                                                    value={`${item.idalmacen}|${item.codigolote}`}
                                                                >
                                                                    {getInventarioLabel(item)}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDetalleRow(row.key)}
                                                        className="mt-6 flex h-9 w-9 items-center justify-center rounded-lg border border-danger/30 text-danger hover:bg-danger/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-3">
                                                    <div>
                                                        <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                                            Cantidad
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            max={selectedInv?.cantidad ?? 9999}
                                                            value={row.cantidad}
                                                            onChange={(e) => updateDetalleRow(row.key, "cantidad", parseInt(e.target.value, 10) || 0)}
                                                            className="mt-1 h-10 w-full rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                                        />
                                                        {selectedInv && (
                                                            <p className="mt-1 text-xs text-[#8B9096]">
                                                                Disponible: {selectedInv.cantidad}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                                            Dosis indicada
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={row.dosis_indicada}
                                                            onChange={(e) => updateDetalleRow(row.key, "dosis_indicada", e.target.value)}
                                                            placeholder="Ej: 1 tableta cada 8h"
                                                            className="mt-1 h-10 w-full rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                                            Tiempo tratamiento
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={row.tiempo_tratamiento}
                                                            onChange={(e) => updateDetalleRow(row.key, "tiempo_tratamiento", e.target.value)}
                                                            placeholder="Ej: 30 días"
                                                            className="mt-1 h-10 w-full rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}

                                {detalleRows.length > 0 && (
                                    <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                                            onClick={handleGuardarDetalles}
                                            disabled={isSavingDetalles}
                                        >
                                            {isSavingDetalles ? "Guardando..." : "Guardar asignación"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Detalle asignado (lotes reales) */}
            {detalles.length > 0 && (
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                            <div>
                                <h2 className="text-base font-semibold text-[#1E1E1E]">Detalle asignado</h2>
                                <p className="text-sm text-[#5B5B5B]/70">Medicamentos del inventario asignados (lote, almacén, dosis).</p>
                            </div>
                            {esEnRevision && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="h-9 gap-1.5 rounded-xl border-danger/30 text-danger hover:bg-danger/10"
                                    onClick={handleEliminarDetalles}
                                    disabled={isDeletingDetalles}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    {isDeletingDetalles ? "Eliminando..." : "Eliminar asignación"}
                                </Button>
                            )}
                        </div>

                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[700px]">
                                <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.7fr_1.2fr_1fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    <span>Medicamento</span>
                                    <span>Lote</span>
                                    <span>Almacén</span>
                                    <span>Cantidad</span>
                                    <span>Dosis indicada</span>
                                    <span>Tiempo tratamiento</span>
                                </div>
                                {detalles.map((d, i) => (
                                    <div
                                        key={`${d.codigolote}-${d.idalmacen}-${i}`}
                                        className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.7fr_1.2fr_1fr] gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                    >
                                        <span className="font-medium">{d.lote?.medicamento?.nombre ?? "—"}</span>
                                        <span>{d.codigolote}</span>
                                        <span>{d.almacen?.nombre ?? d.idalmacen}</span>
                                        <span>{d.cantidad}</span>
                                        <span>{d.dosis_indicada}</span>
                                        <span>{d.tiempo_tratamiento}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ===== MODALES ===== */}

            {/* Modal Cambiar Estado */}
            {showEstadoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Actualizar estado</p>
                                <h3 className="mt-1 text-xl font-semibold text-[#1E1E1E]">
                                    S-{solicitud.numerosolicitud}
                                </h3>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-sm text-[#5B5B5B]/80">Estado actual:</span>
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[solicitud.estado]}`}>
                                        {estadoLabels[solicitud.estado]}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowEstadoModal(false)}
                                className="rounded-lg border border-[#E7E7E7] px-3 py-1 text-sm text-[#5B5B5B] hover:bg-[#F7F7F7]"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="mt-5 flex flex-col gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Nuevo estado</span>
                            <select
                                value={selectedEstado}
                                onChange={(e) => setSelectedEstado(e.target.value as EstadoSolicitud)}
                                className="h-11 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                            >
                                <option value="">Seleccionar estado...</option>
                                {estadosDisponibles.map((e) => (
                                    <option key={e} value={e}>
                                        {estadoLabels[e]}
                                    </option>
                                ))}
                            </select>
                            {selectedEstado && (
                                <span className={`mt-1 w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[selectedEstado as EstadoSolicitud]}`}>
                                    {estadoLabels[selectedEstado as EstadoSolicitud]}
                                </span>
                            )}
                        </div>

                        <div className="mt-4 flex flex-col gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">Observaciones (opcional)</span>
                            <textarea
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                placeholder="Agregar observaciones..."
                                rows={3}
                                className="w-full rounded-lg border border-[#E7E7E7] px-3 py-2 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                className="rounded-xl"
                                onClick={() => setShowEstadoModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                                onClick={handleCambiarEstado}
                                disabled={isUpdatingEstado || !selectedEstado}
                            >
                                {isUpdatingEstado ? "Actualizando..." : "Confirmar cambio"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">{label}</span>
            <span className="text-[#2D3748]">{value}</span>
        </div>
    );
}
