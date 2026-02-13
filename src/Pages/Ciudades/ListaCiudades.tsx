import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EstadoCiudad = "Activo" | "Inactivo";

interface Ciudad {
    id: string;
    nombre: string;
    provincia: string;
    codigo: string;
    estado: EstadoCiudad;
}

const ciudadesData: Ciudad[] = [
    { id: "CIU-001", nombre: "Bogotá", provincia: "Cundinamarca", codigo: "11001", estado: "Activo" },
    { id: "CIU-002", nombre: "Medellín", provincia: "Antioquia", codigo: "05001", estado: "Activo" },
    { id: "CIU-003", nombre: "Cali", provincia: "Valle del Cauca", codigo: "76001", estado: "Activo" },
    { id: "CIU-004", nombre: "Barranquilla", provincia: "Atlántico", codigo: "08001", estado: "Activo" },
    { id: "CIU-005", nombre: "Cartagena", provincia: "Bolívar", codigo: "13001", estado: "Inactivo" },
];

const estadoStyles: Record<EstadoCiudad, string> = {
    Activo: "bg-success-light text-success",
    Inactivo: "bg-warning-light text-warning",
};

export function ListaCiudades() {
    const [ciudades] = useState(ciudadesData);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        return ciudades.filter((item) => {
            if (search.trim() === "") return true;
            const value = search.toLowerCase();
            return (
                item.nombre.toLowerCase().includes(value) ||
                item.provincia.toLowerCase().includes(value) ||
                item.id.toLowerCase().includes(value) ||
                item.codigo.includes(value)
            );
        });
    }, [ciudades, search]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Ciudades</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Gestión de ciudades y ubicaciones.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                >
                    <Link to="/ciudades/nuevo">Registrar ciudad</Link>
                </Button>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <input
                            type="text"
                            placeholder="Buscar ciudad"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-full rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                        />
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[0.8fr_1.5fr_1.5fr_1fr_0.9fr_1.3fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Código</span>
                            <span>Nombre</span>
                            <span>Provincia</span>
                            <span>Cód. postal</span>
                            <span>Estado</span>
                            <span>Acciones</span>
                        </div>

                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-[0.8fr_1.5fr_1.5fr_1fr_0.9fr_1.3fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <span className="font-medium">{item.id}</span>
                                <span className="font-medium">{item.nombre}</span>
                                <span>{item.provincia}</span>
                                <span>{item.codigo}</span>
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${estadoStyles[item.estado]}`}
                                >
                                    {item.estado}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/ciudades/${item.id}`}
                                        className="inline-flex shrink-0 h-9 items-center justify-center whitespace-nowrap rounded-xl bg-donamed-primary px-4 text-xs font-semibold text-white transition hover:bg-donamed-dark"
                                    >
                                        Ver detalle
                                    </Link>
                                    <Link
                                        to={`/ciudades/${item.id}/editar`}
                                        className="inline-flex shrink-0 h-9 items-center justify-center whitespace-nowrap rounded-xl border-2 border-donamed-primary bg-white px-4 text-xs font-semibold text-donamed-primary transition hover:bg-[#F7F7F7]"
                                    >
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No se encontraron ciudades
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
