import { cn } from "@/lib/utils";

type StatusType = "pendiente" | "aprobado" | "rechazado" | "incompleto";

interface Solicitud {
    id: string;
    numeroSolicitud: string;
    fecha: string;
    solicitante: string;
    status: StatusType;
}

const statusConfig: Record<
    StatusType,
    { label: string; bgColor: string; borderColor: string; textColor: string }
> = {
    pendiente: {
        label: "Pendiente",
        bgColor: "bg-warning-light",
        borderColor: "border-warning",
        textColor: "text-warning",
    },
    aprobado: {
        label: "Aprobado",
        bgColor: "bg-success-light",
        borderColor: "border-success",
        textColor: "text-success",
    },
    rechazado: {
        label: "Rechazado",
        bgColor: "bg-danger-light",
        borderColor: "border-danger",
        textColor: "text-danger",
    },
    incompleto: {
        label: "Incompleto",
        bgColor: "bg-pending-light",
        borderColor: "border-pending",
        textColor: "text-pending",
    },
};

interface SolicitudesTableProps {
    solicitudes: Solicitud[];
}

export function SolicitudesTable({ solicitudes }: SolicitudesTableProps) {
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
            {solicitudes.map((solicitud, index) => (
                <div key={solicitud.id}>
                    <div className="flex items-center gap-[70px] px-6 py-4 text-[13px] text-[#2D3748]">
                        <span className="w-8">{String(index + 1).padStart(2, "0")}</span>
                        <span className="w-[132px]">{solicitud.numeroSolicitud}</span>
                        <span className="w-[119px]">{solicitud.fecha}</span>
                        <span className="w-[148px]">{solicitud.solicitante}</span>

                        {/* Status Badge */}
                        <div
                            className={cn(
                                "flex h-6 w-[98px] items-center justify-center rounded-lg border text-[11px] font-medium",
                                statusConfig[solicitud.status].bgColor,
                                statusConfig[solicitud.status].borderColor,
                                statusConfig[solicitud.status].textColor
                            )}
                        >
                            {statusConfig[solicitud.status].label}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-[#EDF2F6]" />
                </div>
            ))}
        </div>
    );
}

export type { Solicitud, StatusType };
