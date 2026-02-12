import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Ban } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EstadoSolicitud =
    | "PENDIENTE"
    | "APROBADA"
    | "RECHAZADA"
    | "DESPACHADA"
    | "EN_REVISION"
    | "CANCELADA"
    | "INCOMPLETA";

interface DetalleMedicamento {
    codigomedicamento: string;
    nombre: string;
    codigolote: string;
    cantidad: number;
    dosis_indicada: string;
    tiempo_tratamiento: string;
}

interface SolicitudDetalle {
    numerosolicitud: number;
    idusuario: number;
    cedularepresentante: string | null;
    codigotiposolicitud: string;
    idcentro: number;
    relacion_solicitante: string | null;
    patologia: string;
    estado: EstadoSolicitud;
    creada_en: string;
    actualizado_en: string;
    observaciones: string | null;
    solicitante?: string;
    centroMedico?: string;
    tipoSolicitud?: string;
    documentos?: { nombre: string; url?: string }[];
    medicamentos: DetalleMedicamento[];
}

const detalleMock: SolicitudDetalle = {
    numerosolicitud: 1,
    idusuario: 1,
    cedularepresentante: "0912345678",
    codigotiposolicitud: "URGENTE",
    idcentro: 1,
    relacion_solicitante: "Madre",
    patologia: "Diabetes tipo 2",
    estado: "PENDIENTE",
    creada_en: "2025-02-10T10:30:00",
    actualizado_en: "2025-02-10T10:30:00",
    observaciones: null,
    solicitante: "María del Carmen",
    centroMedico: "Centro Médico Norte",
    tipoSolicitud: "Urgente",
    documentos: [
        { nombre: "Receta médica.pdf" },
        { nombre: "Cédula del representante.pdf" },
    ],
    medicamentos: [
        {
            codigomedicamento: "MED-001",
            nombre: "Metformina 500mg",
            codigolote: "L-2024-001",
            cantidad: 60,
            dosis_indicada: "1 tableta cada 12 horas",
            tiempo_tratamiento: "3 meses",
        },
        {
            codigomedicamento: "MED-002",
            nombre: "Glibenclamida 5mg",
            codigolote: "L-2024-015",
            cantidad: 30,
            dosis_indicada: "1 tableta con el desayuno",
            tiempo_tratamiento: "3 meses",
        },
    ],
};

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
    return d.toLocaleString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function DetalleSolicitud() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showAcciones, setShowAcciones] = useState(false);
    const [estadoLocal, setEstadoLocal] = useState<EstadoSolicitud | null>(null);

    const solicitud = useMemo(() => {
        const num = id ? parseInt(id, 10) : detalleMock.numerosolicitud;
        return {
            ...detalleMock,
            numerosolicitud: num,
            estado: estadoLocal ?? detalleMock.estado,
        };
    }, [id, estadoLocal]);

    const puedeAprobarRechazar =
        solicitud.estado === "PENDIENTE" || solicitud.estado === "EN_REVISION";

    const handleAccion = (nuevoEstado: EstadoSolicitud) => {
        setEstadoLocal(nuevoEstado);
        setShowAcciones(false);
    };

    return (
        <div className="space-y-6">
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
                        Detalle de Solicitud
                    </h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Información completa de la solicitud de medicamentos.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {puedeAprobarRechazar && (
                        <button
                            type="button"
                            onClick={() => setShowAcciones(true)}
                            className="flex h-10 items-center justify-center rounded-xl border-2 border-[#34A4B3] bg-[#F3F3F3] px-5 text-sm font-semibold text-[#34A4B3] transition hover:bg-[#EDEDED]"
                        >
                            Aprobar / Rechazar
                        </button>
                    )}
                    {solicitud.estado === "APROBADA" && (
                        <Button
                            asChild
                            className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                        >
                            <Link to={`/despachos/S-${solicitud.numerosolicitud}`}>
                                Crear despacho
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Card principal */}
            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Número de solicitud
                            </p>
                            <p className="mt-1 text-lg font-semibold text-[#1E1E1E]">
                                S-{solicitud.numerosolicitud}
                            </p>
                        </div>
                        <span
                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[solicitud.estado]}`}
                        >
                            {estadoLabels[solicitud.estado]}
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Solicitante
                            </span>
                            <span className="text-[#2D3748]">{solicitud.solicitante}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Centro médico
                            </span>
                            <span className="text-[#2D3748]">{solicitud.centroMedico}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Cédula representante
                            </span>
                            <span className="text-[#2D3748]">
                                {solicitud.cedularepresentante ?? "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Relación solicitante
                            </span>
                            <span className="text-[#2D3748]">
                                {solicitud.relacion_solicitante ?? "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Patología
                            </span>
                            <span className="text-[#2D3748]">{solicitud.patologia}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Tipo de solicitud
                            </span>
                            <span className="text-[#2D3748]">{solicitud.tipoSolicitud}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Fecha de creación
                            </span>
                            <span className="text-[#2D3748]">
                                {formatDateTime(solicitud.creada_en)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Última actualización
                            </span>
                            <span className="text-[#2D3748]">
                                {formatDateTime(solicitud.actualizado_en)}
                            </span>
                        </div>
                        {solicitud.observaciones && (
                            <div className="flex flex-col gap-1 text-sm md:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Observaciones
                                </span>
                                <span className="text-[#2D3748]">{solicitud.observaciones}</span>
                            </div>
                        )}
                    </div>

                    {/* Documentos (jsonb) */}
                    {solicitud.documentos && solicitud.documentos.length > 0 && (
                        <div className="mt-6">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Documentos adjuntos
                            </span>
                            <ul className="mt-2 flex flex-wrap gap-2">
                                {solicitud.documentos.map((doc, i) => (
                                    <li
                                        key={i}
                                        className="rounded-lg border border-[#E7E7E7] bg-[#FBFBFC] px-3 py-2 text-sm text-[#2D3748]"
                                    >
                                        {doc.nombre}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tarjetas de resumen */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            Total medicamentos
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">
                            {solicitud.medicamentos.length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-[#EEF1F4]">
                    <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            Total unidades
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">
                            {solicitud.medicamentos.reduce((acc, m) => acc + m.cantidad, 0)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabla de medicamentos (detalle_solicitud) */}
            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">
                            Medicamentos solicitados
                        </h2>
                        <p className="text-sm text-[#5B5B5B]/70">
                            Detalle según tabla detalle_solicitud (medicamento, lote, cantidad, dosis, tiempo).
                        </p>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[1.2fr_0.8fr_0.7fr_1.2fr_1fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Medicamento</span>
                            <span>Lote</span>
                            <span>Cantidad</span>
                            <span>Dosis indicada</span>
                            <span>Tiempo tratamiento</span>
                        </div>

                        {solicitud.medicamentos.map((med) => (
                            <div
                                key={med.codigomedicamento + med.codigolote}
                                className="grid grid-cols-[1.2fr_0.8fr_0.7fr_1.2fr_1fr] gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <span className="font-medium">{med.nombre}</span>
                                <span>{med.codigolote}</span>
                                <span>{med.cantidad}</span>
                                <span>{med.dosis_indicada}</span>
                                <span>{med.tiempo_tratamiento}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Modal Aprobar / Rechazar */}
            {showAcciones && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-[0px_30px_80px_-40px_rgba(0,0,0,0.6)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Actualizar estado
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-[#1E1E1E]">
                                    S-{solicitud.numerosolicitud} · {solicitud.solicitante}
                                </h3>
                                <p className="mt-2 text-sm text-[#5B5B5B]/80">
                                    Selecciona una acción para actualizar el estado de la solicitud.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAcciones(false)}
                                className="rounded-lg border border-[#E7E7E7] px-3 py-1 text-sm text-[#5B5B5B] hover:bg-[#F7F7F7]"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <Button
                                type="button"
                                className="h-11 gap-2 rounded-xl bg-success text-white hover:bg-success/90"
                                onClick={() => handleAccion("APROBADA")}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Aprobar
                            </Button>
                            <Button
                                type="button"
                                className="h-11 gap-2 rounded-xl bg-danger text-white hover:bg-danger/90"
                                onClick={() => handleAccion("RECHAZADA")}
                            >
                                <XCircle className="h-4 w-4" />
                                Rechazar
                            </Button>
                            <Button
                                type="button"
                                className="h-11 gap-2 rounded-xl bg-warning text-white hover:bg-warning/90"
                                onClick={() => handleAccion("CANCELADA")}
                            >
                                <Ban className="h-4 w-4" />
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
