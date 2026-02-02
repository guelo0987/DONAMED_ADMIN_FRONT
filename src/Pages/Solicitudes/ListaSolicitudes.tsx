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
        <div>
            {/* Page Title */}
            <h1 className="mb-6 text-2xl font-semibold text-[#404040]">Solicitudes</h1>

            {/* Main Card */}
            <Card className="">
                <CardContent className="p-6">
                    {/* Search and Filter Row */}
                    <div className="mb-6 flex items-center justify-end gap-4">
                        {/* Search Bar */}
                        <div className="flex h-10 w-[200px] items-center gap-2 rounded-lg border border-[#E7E7E7] bg-white px-3">
                            <input
                                type="text"
                                placeholder="Buscar"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                            />
                            <Search className="h-4 w-4 text-[#5B5B5B]" />
                        </div>

                        {/* Filters Dropdown */}
                        <button className="flex h-10 items-center gap-2 rounded-lg border border-[#E7E7E7] bg-white px-4 text-sm text-[#5B5B5B]">
                            <span>Filtros</span>
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Table */}
                    <div className="w-full">
                        {/* Header */}
                        <div className="grid grid-cols-3 gap-4 border-b border-[#EDF2F6] pb-4 text-sm font-medium text-[#5F6368]">
                            <span>Número de Solicitud</span>
                            <span>Fecha de Solicitud</span>
                            <span>Nombre del Solicitante</span>
                        </div>

                        {/* Rows */}
                        {filteredSolicitudes.map((solicitud) => (
                            <div
                                key={solicitud.id}
                                className="grid grid-cols-3 gap-4 border-b border-[#EDF2F6] py-4 text-sm text-[#2D3748] last:border-b-0"
                            >
                                <span>{solicitud.numeroSolicitud}</span>
                                <span>{solicitud.fecha}</span>
                                <span>{solicitud.solicitante}</span>
                            </div>
                        ))}

                        {/* Empty State */}
                        {filteredSolicitudes.length === 0 && (
                            <div className="py-8 text-center text-sm text-[#5B5B5B]/60">
                                No se encontraron solicitudes
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
