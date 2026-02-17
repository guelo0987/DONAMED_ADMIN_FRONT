import { cn } from "@/lib/utils";

type StatusType = "PENDIENTE" | "EN_REVISION" | "APROBADA" | "RECHAZADA" | "DESPACHADA" | "ENTREGADA";

interface Solicitud {
    numero: number;
    numeroSolicitud: string;
    fecha: string;
    nombreSolicitante: string;
    estado: string;
}

const statusConfig: Record<string, { label: string; bgColor: string; borderColor: string; textColor: string }> = {
    PENDIENTE: {
        label: "Pendiente",
        bgColor: "bg-warning-light",
        borderColor: "border-warning",
        textColor: "text-warning",
    },
    EN_REVISION: {
        label: "En revisión",
        bgColor: "bg-pending-light",
        borderColor: "border-pending",
        textColor: "text-pending",
    },
    APROBADA: {
        label: "Aprobada",
        bgColor: "bg-success-light",
        borderColor: "border-success",
        textColor: "text-success",
    },
    RECHAZADA: {
        label: "Rechazada",
        bgColor: "bg-danger-light",
        borderColor: "border-danger",
        textColor: "text-danger",
    },
    DESPACHADA: {
        label: "Despachada",
        bgColor: "bg-donamed-light",
        borderColor: "border-donamed-primary",
        textColor: "text-donamed-primary",
    },
    ENTREGADA: {
        label: "Entregada",
        bgColor: "bg-success-light",
        borderColor: "border-success",
        textColor: "text-success",
    },
};

function formatFecha(fecha: string): string {
    try {
        return new Date(fecha).toLocaleDateString("es-DO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    } catch {
        return fecha;
    }
}

interface SolicitudesTableProps {
    solicitudes: Solicitud[];
}

export function SolicitudesTable({ solicitudes }: SolicitudesTableProps) {
    const fallbackStatus = {
        label: "Desconocido",
        bgColor: "bg-[#F0F0F0]",
        borderColor: "border-[#CCC]",
        textColor: "text-[#666]",
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center gap-[70px] px-6 py-4 text-[13px] text-[#5F6368]">
                <span className="w-8">#</span>
                <span className="w-[132px]">Número de Solicitud</span>
                <span className="w-[119px]">Fecha de Solicitud</span>
                <span className="w-[148px]">Nombre del Solicitante</span>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-[#EDF2F6]" />

            {/* Rows */}
            {solicitudes.map((solicitud) => {
                const config = statusConfig[solicitud.estado] ?? fallbackStatus;
                return (
                    <div key={solicitud.numero}>
                        <div className="flex items-center gap-[70px] px-6 py-4 text-[13px] text-[#2D3748]">
                            <span className="w-8">{String(solicitud.numero).padStart(2, "0")}</span>
                            <span className="w-[132px]">{solicitud.numeroSolicitud}</span>
                            <span className="w-[119px]">{formatFecha(solicitud.fecha)}</span>
                            <span className="w-[148px]">{solicitud.nombreSolicitante}</span>

                            {/* Status Badge */}
                            <div
                                className={cn(
                                    "flex h-6 w-[98px] items-center justify-center rounded-lg border text-[11px] font-medium",
                                    config.bgColor,
                                    config.borderColor,
                                    config.textColor
                                )}
                            >
                                {config.label}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-[#EDF2F6]" />
                    </div>
                );
            })}

            {solicitudes.length === 0 && (
                <div className="py-8 text-center text-sm text-[#5B5B5B]/60">
                    No hay solicitudes recientes
                </div>
            )}
        </div>
    );
}

export type { Solicitud, StatusType };
