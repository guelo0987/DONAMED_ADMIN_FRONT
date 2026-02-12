import { useMemo, useState } from "react";
import { Search, Eye, PencilLine, CheckCircle2, XCircle, Ban, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EstadoDonacion = "Registrada" | "Validada" | "Rechazada" | "Cancelada";

interface Donacion {
    id: string;
    donante: string;
    fecha: string;
    totalMedicamentos: number;
    estado: EstadoDonacion;
    registradoPor: string;
}

const donacionesData: Donacion[] = [
    {
        id: "D-24589",
        donante: "Laboratorios Sanar",
        fecha: "2025-09-24",
        totalMedicamentos: 320,
        estado: "Registrada",
        registradoPor: "Laura P.",
    },
    {
        id: "D-24590",
        donante: "FarmaPlus",
        fecha: "2025-09-22",
        totalMedicamentos: 180,
        estado: "Validada",
        registradoPor: "Carlos M.",
    },
    {
        id: "D-24591",
        donante: "Clínica Horizonte",
        fecha: "2025-09-18",
        totalMedicamentos: 95,
        estado: "Rechazada",
        registradoPor: "Diana R.",
    },
    {
        id: "D-24592",
        donante: "BioHealth",
        fecha: "2025-09-15",
        totalMedicamentos: 410,
        estado: "Cancelada",
        registradoPor: "Mateo G.",
    },
];

const statusStyles: Record<EstadoDonacion, string> = {
    Registrada: "bg-donamed-light text-donamed-dark",
    Validada: "bg-success-light text-success",
    Rechazada: "bg-danger-light text-danger",
    Cancelada: "bg-warning-light text-warning",
};

export function ListaDonaciones() {
    const [donaciones, setDonaciones] = useState(donacionesData);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [donor, setDonor] = useState("");
    const [status, setStatus] = useState<EstadoDonacion | "all">("all");
    const [validationTarget, setValidationTarget] = useState<Donacion | null>(null);
    const [eliminarTarget, setEliminarTarget] = useState<Donacion | null>(null);

    const handleEliminar = () => {
        if (!eliminarTarget) return;
        setDonaciones((prev) => prev.filter((d) => d.id !== eliminarTarget.id));
        setEliminarTarget(null);
    };

    const filteredDonaciones = useMemo(() => {
        return donaciones.filter((donacion) => {
            const matchesSearch =
                searchTerm.trim() === "" ||
                donacion.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donacion.donante.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDonor =
                donor.trim() === "" ||
                donacion.donante.toLowerCase().includes(donor.toLowerCase());
            const matchesStatus = status === "all" || donacion.estado === status;
            const matchesFrom = dateFrom === "" || donacion.fecha >= dateFrom;
            const matchesTo = dateTo === "" || donacion.fecha <= dateTo;

            return matchesSearch && matchesDonor && matchesStatus && matchesFrom && matchesTo;
        });
    }, [donaciones, searchTerm, donor, status, dateFrom, dateTo]);

    const handleValidation = (nextStatus: Exclude<EstadoDonacion, "Registrada">) => {
        if (!validationTarget) return;
        setDonaciones((prev) =>
            prev.map((item) =>
                item.id === validationTarget.id ? { ...item, estado: nextStatus } : item
            )
        );
        setValidationTarget(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Donaciones</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Controla y valida donaciones de medicamentos en tiempo real.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-11 gap-2 rounded-xl bg-donamed-primary px-5 text-sm font-semibold hover:bg-donamed-dark"
                >
                    <Link to="/donaciones/nueva">
                        <Plus className="h-4 w-4" />
                        Nueva Donación
                    </Link>
                </Button>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <div className="flex items-center gap-3 text-sm text-[#5B5B5B]/80">
                            <span className="rounded-full bg-donamed-light px-3 py-1 text-xs font-semibold text-donamed-dark">
                                {filteredDonaciones.length} donaciones
                            </span>
                            <span>Últimos 30 días</span>
                        </div>

                        <div className="group flex h-11 w-[260px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por ID o donante"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="border-b border-[#EEF1F4] bg-white px-6 py-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Rango de fechas
                                </span>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="h-10 w-full rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    />
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="h-10 w-full rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Donante
                                </span>
                                <input
                                    type="text"
                                    value={donor}
                                    onChange={(e) => setDonor(e.target.value)}
                                    placeholder="Nombre del donante"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Estado
                                </span>
                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(e.target.value as EstadoDonacion | "all")
                                    }
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="all">Todos</option>
                                    <option value="Registrada">Registrada</option>
                                    <option value="Validada">Validada</option>
                                    <option value="Rechazada">Rechazada</option>
                                    <option value="Cancelada">Cancelada</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[1.1fr_1.4fr_1fr_1fr_1fr_1.2fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Código</span>
                            <span>Donante</span>
                            <span>Fecha</span>
                            <span>Total medicamentos</span>
                            <span>Estado</span>
                            <span>Acciones</span>
                        </div>

                        {filteredDonaciones.map((donacion) => (
                            <div
                                key={donacion.id}
                                className="grid grid-cols-[1.1fr_1.4fr_1fr_1fr_1fr_1.2fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <span className="font-medium">{donacion.id}</span>
                                <span>{donacion.donante}</span>
                                <span>{donacion.fecha}</span>
                                <span>{donacion.totalMedicamentos}</span>
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[donacion.estado]}`}
                                >
                                    {donacion.estado}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/donaciones/${donacion.id}`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        to={`/donaciones/${donacion.id}/editar`}
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark ${donacion.estado !== "Registrada" ? "pointer-events-none opacity-40" : ""}`}
                                    >
                                        <PencilLine className="h-4 w-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setValidationTarget(donacion)}
                                        className="flex h-9 items-center justify-center rounded-xl bg-donamed-primary px-4 text-xs font-semibold text-white transition hover:bg-donamed-dark"
                                    >
                                        Validar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEliminarTarget(donacion)}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-danger transition hover:border-danger/40 hover:bg-danger/5"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredDonaciones.length === 0 && (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No se encontraron donaciones
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            {validationTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-[0px_30px_80px_-40px_rgba(0,0,0,0.6)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Validar donación
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-[#1E1E1E]">
                                    {validationTarget.id} · {validationTarget.donante}
                                </h3>
                                <p className="mt-2 text-sm text-[#5B5B5B]/80">
                                    Selecciona una acción para actualizar el estado de la donación.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setValidationTarget(null)}
                                className="rounded-lg border border-[#E7E7E7] px-3 py-1 text-sm text-[#5B5B5B] hover:bg-[#F7F7F7]"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <Button
                                type="button"
                                className="h-11 gap-2 rounded-xl bg-success text-white hover:bg-success/90"
                                onClick={() => handleValidation("Validada")}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Aceptar
                            </Button>
                            <Button
                                type="button"
                                className="h-11 gap-2 rounded-xl bg-danger text-white hover:bg-danger/90"
                                onClick={() => handleValidation("Rechazada")}
                            >
                                <XCircle className="h-4 w-4" />
                                Rechazar
                            </Button>
                            <Button
                                type="button"
                                className="h-11 gap-2 rounded-xl bg-warning text-white hover:bg-warning/90"
                                onClick={() => handleValidation("Cancelada")}
                            >
                                <Ban className="h-4 w-4" />
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {eliminarTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-[0px_30px_80px_-40px_rgba(0,0,0,0.6)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Eliminar donación
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-[#1E1E1E]">
                                    {eliminarTarget.id} · {eliminarTarget.donante}
                                </h3>
                                <p className="mt-2 text-sm text-[#5B5B5B]/80">
                                    ¿Estás seguro? Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEliminarTarget(null)}
                                className="rounded-lg border border-[#E7E7E7] px-3 py-1 text-sm text-[#5B5B5B] hover:bg-[#F7F7F7]"
                            >
                                Cerrar
                            </button>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 rounded-xl"
                                onClick={() => setEliminarTarget(null)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                className="h-11 rounded-xl bg-danger text-white hover:bg-danger/90"
                                onClick={handleEliminar}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
