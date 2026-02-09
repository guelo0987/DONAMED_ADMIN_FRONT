import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EstadoDespacho = "Pendiente" | "Listo" | "Despachado";

interface SolicitudDespacho {
    id: string;
    paciente: string;
    fecha: string;
    tipo: string;
    centro: string;
    estado: EstadoDespacho;
}

const solicitudesData: SolicitudDespacho[] = [
    {
        id: "S-023869869",
        paciente: "Maria del Carmen",
        fecha: "2025-09-24",
        tipo: "Urgente",
        centro: "Centro Medico Norte",
        estado: "Listo",
    },
    {
        id: "S-8596321474",
        paciente: "Luis Andrade",
        fecha: "2025-09-22",
        tipo: "Programada",
        centro: "Clinica Horizonte",
        estado: "Pendiente",
    },
    {
        id: "S-7412589632",
        paciente: "Ana Perez",
        fecha: "2025-09-20",
        tipo: "Urgente",
        centro: "Hospital Central",
        estado: "Listo",
    },
];

const estadoStyles: Record<EstadoDespacho, string> = {
    Pendiente: "bg-warning-light text-warning",
    Listo: "bg-success-light text-success",
    Despachado: "bg-donamed-light text-donamed-dark",
};

export function ListaDespachos() {
    const [fecha, setFecha] = useState("");
    const [tipo, setTipo] = useState("");
    const [centro, setCentro] = useState("");
    const [estado, setEstado] = useState<EstadoDespacho | "all">("all");

    const filtered = useMemo(() => {
        return solicitudesData.filter((item) => {
            const matchesFecha = fecha === "" || item.fecha === fecha;
            const matchesTipo = tipo === "" || item.tipo === tipo;
            const matchesCentro =
                centro.trim() === "" || item.centro.toLowerCase().includes(centro.toLowerCase());
            const matchesEstado = estado === "all" || item.estado === estado;

            return matchesFecha && matchesTipo && matchesCentro && matchesEstado;
        });
    }, [fecha, tipo, centro, estado]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Despachos</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Solicitudes aprobadas y listas para despacho.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                >
                    <Link to="/despachos/historial">Historial de despachos</Link>
                </Button>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-white px-6 py-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Fecha
                                </span>
                                <input
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Tipo de solicitud
                                </span>
                                <select
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Todos</option>
                                    <option value="Urgente">Urgente</option>
                                    <option value="Programada">Programada</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Centro medico
                                </span>
                                <input
                                    type="text"
                                    value={centro}
                                    onChange={(e) => setCentro(e.target.value)}
                                    placeholder="Centro medico"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Estado
                                </span>
                                <select
                                    value={estado}
                                    onChange={(e) =>
                                        setEstado(e.target.value as EstadoDespacho | "all")
                                    }
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="all">Todos</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Listo">Listo</option>
                                    <option value="Despachado">Despachado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[1fr_1.4fr_1fr_1fr_1fr_1.1fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Numero de solicitud</span>
                            <span>Paciente / Centro medico</span>
                            <span>Fecha</span>
                            <span>Tipo</span>
                            <span>Estado</span>
                            <span>Accion</span>
                        </div>

                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-[1fr_1.4fr_1fr_1fr_1fr_1.1fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <span className="font-medium">{item.id}</span>
                                <div className="flex flex-col">
                                    <span>{item.paciente}</span>
                                    <span className="text-xs text-[#5B5B5B]/70">{item.centro}</span>
                                </div>
                                <span>{item.fecha}</span>
                                <span>{item.tipo}</span>
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${estadoStyles[item.estado]}`}
                                >
                                    {item.estado}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/despachos/${item.id}`}
                                        className="inline-flex h-9 items-center justify-center rounded-xl bg-donamed-primary px-3 text-xs font-semibold text-white transition hover:bg-donamed-dark"
                                    >
                                        Despachar
                                    </Link>
                                    <Link
                                        to={`/despachos/${item.id}/detalle`}
                                        className="inline-flex h-9 items-center justify-center rounded-xl border-2 border-donamed-primary bg-white px-3 text-xs font-semibold text-donamed-primary transition hover:bg-[#F7F7F7]"
                                    >
                                        Ver detalle
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No se encontraron solicitudes
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
