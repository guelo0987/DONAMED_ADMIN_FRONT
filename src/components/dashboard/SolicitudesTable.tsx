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
        bgColor: "bg-warning-light dark:bg-amber-500/12",
        borderColor: "border-warning dark:border-amber-400/25",
        textColor: "text-warning dark:text-amber-200",
    },
    EN_REVISION: {
        label: "En revisión",
        bgColor: "bg-pending-light dark:bg-orange-500/12",
        borderColor: "border-pending dark:border-orange-400/25",
        textColor: "text-pending dark:text-orange-200",
    },
    APROBADA: {
        label: "Aprobada",
        bgColor: "bg-success-light dark:bg-emerald-500/12",
        borderColor: "border-success dark:border-emerald-400/25",
        textColor: "text-success dark:text-emerald-200",
    },
    RECHAZADA: {
        label: "Rechazada",
        bgColor: "bg-danger-light dark:bg-rose-500/12",
        borderColor: "border-danger dark:border-rose-400/25",
        textColor: "text-danger dark:text-rose-200",
    },
    DESPACHADA: {
        label: "Despachada",
        bgColor: "bg-donamed-light dark:bg-cyan-500/12",
        borderColor: "border-donamed-primary dark:border-cyan-300/25",
        textColor: "text-donamed-primary dark:text-cyan-200",
    },
    ENTREGADA: {
        label: "Entregada",
        bgColor: "bg-success-light dark:bg-emerald-500/12",
        borderColor: "border-success dark:border-emerald-400/25",
        textColor: "text-success dark:text-emerald-200",
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
        bgColor: "bg-[#F0F0F0] dark:bg-white/5",
        borderColor: "border-[#CCC] dark:border-white/10",
        textColor: "text-[#666] dark:text-slate-300",
    };

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[640px]">
                <div className="grid grid-cols-[48px_132px_119px_minmax(160px,1fr)_110px] items-center gap-4 px-6 py-4 text-[13px] text-[#5F6368] dark:text-slate-400">
                    <span>#</span>
                    <span>Número de Solicitud</span>
                    <span>Fecha de Solicitud</span>
                    <span>Nombre del Solicitante</span>
                    <span className="justify-self-end text-right">Estado</span>
                </div>

                <div className="h-px w-full bg-[#EDF2F6] dark:bg-white/10" />

                {solicitudes.map((solicitud) => {
                    const config = statusConfig[solicitud.estado] ?? fallbackStatus;
                    return (
                        <div key={solicitud.numero}>
                            <div className="grid grid-cols-[48px_132px_119px_minmax(160px,1fr)_110px] items-center gap-4 px-6 py-4 text-[13px] text-[#2D3748] transition-colors hover:bg-black/[0.015] dark:text-slate-200 dark:hover:bg-white/[0.025]">
                                <span>{String(solicitud.numero).padStart(2, "0")}</span>
                                <span>{solicitud.numeroSolicitud}</span>
                                <span>{formatFecha(solicitud.fecha)}</span>
                                <span className="truncate">{solicitud.nombreSolicitante}</span>

                                <div
                                    className={cn(
                                        "flex h-6 w-[98px] items-center justify-center justify-self-end rounded-lg border text-[11px] font-medium",
                                        config.bgColor,
                                        config.borderColor,
                                        config.textColor
                                    )}
                                >
                                    {config.label}
                                </div>
                            </div>

                            <div className="h-px w-full bg-[#EDF2F6] dark:bg-white/10" />
                        </div>
                    );
                })}

                {solicitudes.length === 0 && (
                    <div className="py-8 text-center text-sm text-[#5B5B5B]/60 dark:text-slate-400">
                        No hay solicitudes recientes
                    </div>
                )}
            </div>
        </div>
    );
}

export type { Solicitud, StatusType };
