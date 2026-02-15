import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EstadoProvincia = "Activo" | "Inactivo";

interface Provincia {
    id: string;
    nombre: string;
    pais: string;
    descripcion: string;
    estado: EstadoProvincia;
}

const provinciasData: Provincia[] = [
    { id: "PRO-001", nombre: "Cundinamarca", pais: "Colombia", descripcion: "Departamento del centro del país", estado: "Activo" },
    { id: "PRO-002", nombre: "Antioquia", pais: "Colombia", descripcion: "Departamento del noroccidente", estado: "Activo" },
    { id: "PRO-003", nombre: "Valle del Cauca", pais: "Colombia", descripcion: "Departamento del suroccidente", estado: "Activo" },
    { id: "PRO-004", nombre: "Atlántico", pais: "Colombia", descripcion: "Departamento de la costa Caribe", estado: "Activo" },
    { id: "PRO-005", nombre: "Bolívar", pais: "Colombia", descripcion: "Departamento del Caribe colombiano", estado: "Inactivo" },
];

const estadoStyles: Record<EstadoProvincia, string> = {
    Activo: "bg-success-light text-success",
    Inactivo: "bg-warning-light text-warning",
};

export function ListaProvincias() {
    const [provincias] = useState(provinciasData);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        return provincias.filter((item) => {
            if (search.trim() === "") return true;
            const value = search.toLowerCase();
            return (
                item.nombre.toLowerCase().includes(value) ||
                item.pais.toLowerCase().includes(value) ||
                item.descripcion.toLowerCase().includes(value) ||
                item.id.toLowerCase().includes(value)
            );
        });
    }, [provincias, search]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Provincias</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Gestión de provincias y departamentos.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                >
                    <Link to="/provincias/nuevo">Registrar provincia</Link>
                </Button>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <input
                            type="text"
                            placeholder="Buscar provincia"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-full rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                        />
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[0.8fr_1.5fr_1.2fr_2fr_0.9fr_1.3fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Código</span>
                            <span>Nombre</span>
                            <span>País</span>
                            <span>Descripción</span>
                            <span>Estado</span>
                            <span>Acciones</span>
                        </div>

                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-[0.8fr_1.5fr_1.2fr_2fr_0.9fr_1.3fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <span className="font-medium">{item.id}</span>
                                <span className="font-medium">{item.nombre}</span>
                                <span>{item.pais}</span>
                                <span className="truncate text-[#5B5B5B]/90" title={item.descripcion}>
                                    {item.descripcion}
                                </span>
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${estadoStyles[item.estado]}`}
                                >
                                    {item.estado}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/provincias/${item.id}`}
                                        className="inline-flex shrink-0 h-9 items-center justify-center whitespace-nowrap rounded-xl bg-donamed-primary px-4 text-xs font-semibold text-white transition hover:bg-donamed-dark"
                                    >
                                        Ver detalle
                                    </Link>
                                    <Link
                                        to={`/provincias/${item.id}/editar`}
                                        className="inline-flex shrink-0 h-9 items-center justify-center whitespace-nowrap rounded-xl border-2 border-donamed-primary bg-white px-4 text-xs font-semibold text-donamed-primary transition hover:bg-[#F7F7F7]"
                                    >
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No se encontraron provincias
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
