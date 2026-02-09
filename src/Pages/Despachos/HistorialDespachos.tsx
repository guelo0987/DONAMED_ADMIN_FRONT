import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type EstadoDespacho = "Despachado" | "Revertido";

interface HistorialItem {
    id: string;
    solicitud: string;
    paciente: string;
    fecha: string;
    usuario: string;
    estado: EstadoDespacho;
}

const historialData: HistorialItem[] = [
    {
        id: "D-9001",
        solicitud: "S-023869869",
        paciente: "Maria del Carmen",
        fecha: "2025-09-26 11:00",
        usuario: "Carlos M.",
        estado: "Despachado",
    },
    {
        id: "D-9002",
        solicitud: "S-7412589632",
        paciente: "Ana Perez",
        fecha: "2025-09-26 12:30",
        usuario: "Diana R.",
        estado: "Despachado",
    },
    {
        id: "D-9003",
        solicitud: "S-8596321474",
        paciente: "Luis Andrade",
        fecha: "2025-09-25 09:10",
        usuario: "Laura P.",
        estado: "Revertido",
    },
];

const estadoStyles: Record<EstadoDespacho, string> = {
    Despachado: "bg-success-light text-success",
    Revertido: "bg-warning-light text-warning",
};

export function HistorialDespachos() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<HistorialItem | null>(null);
    const [motivo, setMotivo] = useState("");
    const [isAuthorized] = useState(true);
    const [search, setSearch] = useState("");
    const [estado, setEstado] = useState<EstadoDespacho | "all">("all");
    const [usuario, setUsuario] = useState("");
    const [fecha, setFecha] = useState("");

    const filtered = useMemo(() => {
        return historialData.filter((item) => {
            const value = search.toLowerCase();
            const matchesSearch =
                search.trim() === "" ||
                item.id.toLowerCase().includes(value) ||
                item.solicitud.toLowerCase().includes(value) ||
                item.paciente.toLowerCase().includes(value) ||
                item.usuario.toLowerCase().includes(value);
            const matchesEstado = estado === "all" || item.estado === estado;
            const matchesUsuario =
                usuario.trim() === "" || item.usuario.toLowerCase().includes(usuario.toLowerCase());
            const matchesFecha = fecha === "" || item.fecha.startsWith(fecha);

            return matchesSearch && matchesEstado && matchesUsuario && matchesFecha;
        });
    }, [search, estado, usuario, fecha]);

    const handleRevert = () => {
        setSelected(null);
        setMotivo("");
    };

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/despachos")}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a despachos
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Historial de Despachos
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Registro de todos los despachos realizados y sus reversos.
                </p>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <div className="flex items-center gap-3 text-sm text-[#5B5B5B]/80">
                            <span className="rounded-full bg-donamed-light px-3 py-1 text-xs font-semibold text-donamed-dark">
                                {filtered.length} despachos
                            </span>
                            <span>Historial general</span>
                        </div>
                        <div className="group flex h-11 w-[260px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar despacho"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                            />
                        </div>
                    </div>
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
                                    Usuario
                                </span>
                                <input
                                    type="text"
                                    value={usuario}
                                    onChange={(e) => setUsuario(e.target.value)}
                                    placeholder="Usuario"
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
                                    <option value="Despachado">Despachado</option>
                                    <option value="Revertido">Revertido</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="grid grid-cols-[1fr_1.1fr_1.2fr_1fr_1fr_0.9fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Despacho</span>
                            <span>Solicitud</span>
                            <span>Paciente</span>
                            <span>Fecha</span>
                            <span>Usuario</span>
                            <span>Acciones</span>
                        </div>

                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-[1fr_1.1fr_1.2fr_1fr_1fr_0.9fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{item.id}</span>
                                    <span
                                        className={`mt-1 w-fit rounded-full px-3 py-1 text-xs font-semibold ${estadoStyles[item.estado]}`}
                                    >
                                        {item.estado}
                                    </span>
                                </div>
                                <span>{item.solicitud}</span>
                                <span>{item.paciente}</span>
                                <span>{item.fecha}</span>
                                <span>{item.usuario}</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-9 rounded-xl"
                                    >
                                        <Link to={`/despachos/historial/${item.id}`}>Ver detalle</Link>
                                    </Button>
                                    <Button
                                        type="button"
                                        className="h-9 rounded-xl bg-[#1C5961] text-white hover:bg-[#16484F]"
                                        onClick={() => setSelected(item)}
                                        disabled={!isAuthorized || item.estado === "Revertido"}
                                    >
                                        Revertir
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No se encontraron despachos
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-[0px_30px_80px_-40px_rgba(0,0,0,0.6)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Anulacion / Reverso de despacho
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-[#1E1E1E]">
                                    {selected.id} · {selected.solicitud}
                                </h3>
                                <p className="mt-2 text-sm text-[#5B5B5B]/80">
                                    Esta accion reintegra el inventario y deja trazabilidad.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="rounded-lg border border-[#E7E7E7] px-3 py-1 text-sm text-[#5B5B5B] hover:bg-[#F7F7F7]"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="mt-5">
                            <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Motivo
                            </label>
                            <textarea
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                placeholder="Describe el motivo del reverso"
                                className="mt-2 min-h-[110px] w-full rounded-lg border border-[#E7E7E7] px-3 py-2 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                            />
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 rounded-xl"
                                onClick={() => setSelected(null)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                className="h-10 rounded-xl bg-[#1C5961] text-white hover:bg-[#16484F]"
                                onClick={handleRevert}
                            >
                                Confirmar reverso
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
