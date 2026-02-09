import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Solicitud {
    id: string;
    numeroSolicitud: string;
    fecha: string;
    solicitante: string;
}

// Sample data
const solicitudesData: Solicitud[] = [
    {
        id: "1",
        numeroSolicitud: "S-023669869",
        fecha: "24/09/2025",
        solicitante: "María del Carmen",
    },
    {
        id: "2",
        numeroSolicitud: "S-8596321474",
        fecha: "15/05/2025",
        solicitante: "María del Carmen",
    },
    {
        id: "3",
        numeroSolicitud: "S-7412589632",
        fecha: "12/12/2025",
        solicitante: "María del Carmen",
    },
    {
        id: "4",
        numeroSolicitud: "S-3698521474",
        fecha: "16/12/2025",
        solicitante: "María del Carmen",
    },
];

export function ListaSolicitudes() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSolicitudes, setFilteredSolicitudes] = useState(solicitudesData);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (value.trim() === "") {
            setFilteredSolicitudes(solicitudesData);
        } else {
            const filtered = solicitudesData.filter(
                (s) =>
                    s.numeroSolicitud.toLowerCase().includes(value.toLowerCase()) ||
                    s.solicitante.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSolicitudes(filtered);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Solicitudes</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Gestiona y visualiza las solicitudes más recientes.
                    </p>
                </div>
                <button className="flex h-10 items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-4 text-sm font-medium text-[#5B5B5B] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <span>Filtros</span>
                    <ChevronDown className="h-4 w-4" />
                </button>
            </div>

            {/* Main Card */}
            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <div className="flex items-center gap-3 text-sm text-[#5B5B5B]/80">
                            <span className="rounded-full bg-donamed-light px-3 py-1 text-xs font-semibold text-donamed-dark">
                                {filteredSolicitudes.length} resultados
                            </span>
                            <span>Actualizado hoy</span>
                        </div>

                        {/* Search Bar */}
                        <div className="group flex h-11 w-[260px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar solicitud o solicitante"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="w-full">
                        {/* Header */}
                        <div className="grid grid-cols-3 gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Número de Solicitud</span>
                            <span>Fecha de Solicitud</span>
                            <span>Nombre del Solicitante</span>
                        </div>

                        {/* Rows */}
                        {filteredSolicitudes.map((solicitud) => (
                            <div
                                key={solicitud.id}
                                className="grid grid-cols-3 gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-donamed-primary" />
                                    <span className="font-medium">{solicitud.numeroSolicitud}</span>
                                </div>
                                <span>{solicitud.fecha}</span>
                                <span>{solicitud.solicitante}</span>
                            </div>
                        ))}

                        {/* Empty State */}
                        {filteredSolicitudes.length === 0 && (
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
