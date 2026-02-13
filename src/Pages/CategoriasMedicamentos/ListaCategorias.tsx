import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EstadoCategoria = "Activo" | "Inactivo";

interface Categoria {
    id: string;
    nombre: string;
    descripcion: string;
    estado: EstadoCategoria;
}

const categoriasData: Categoria[] = [
    {
        id: "CAT-001",
        nombre: "Antibióticos",
        descripcion: "Medicamentos para el tratamiento de infecciones bacterianas",
        estado: "Activo",
    },
    {
        id: "CAT-002",
        nombre: "Analgésicos",
        descripcion: "Medicamentos para aliviar el dolor",
        estado: "Activo",
    },
    {
        id: "CAT-003",
        nombre: "Antidiabéticos",
        descripcion: "Medicamentos para el control de la diabetes",
        estado: "Activo",
    },
    {
        id: "CAT-004",
        nombre: "Antiinflamatorios",
        descripcion: "Medicamentos para reducir la inflamación",
        estado: "Inactivo",
    },
];

const estadoStyles: Record<EstadoCategoria, string> = {
    Activo: "bg-success-light text-success",
    Inactivo: "bg-warning-light text-warning",
};

export function ListaCategorias() {
    const [categorias] = useState(categoriasData);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        return categorias.filter((item) => {
            if (search.trim() === "") return true;
            const value = search.toLowerCase();
            return (
                item.nombre.toLowerCase().includes(value) ||
                item.descripcion.toLowerCase().includes(value) ||
                item.id.toLowerCase().includes(value)
            );
        });
    }, [categorias, search]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                        Categorías de medicamentos
                    </h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Gestion de categorías para clasificación del catálogo.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                >
                    <Link to="/categorias/nuevo">Registrar categoría</Link>
                </Button>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <input
                            type="text"
                            placeholder="Buscar categoría"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-full rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                        />
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[0.8fr_1.5fr_2fr_0.9fr_1fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Código</span>
                            <span>Nombre</span>
                            <span>Descripción</span>
                            <span>Estado</span>
                            <span>Acciones</span>
                        </div>

                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-[0.8fr_1.5fr_2fr_0.9fr_1fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <span className="font-medium">{item.id}</span>
                                <span className="font-medium">{item.nombre}</span>
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
                                        to={`/categorias/${item.id}`}
                                        className="inline-flex shrink-0 h-9 items-center justify-center whitespace-nowrap rounded-xl bg-donamed-primary px-4 text-xs font-semibold text-white transition hover:bg-donamed-dark"
                                    >
                                        Ver detalle
                                    </Link>
                                    <Link
                                        to={`/categorias/${item.id}/editar`}
                                        className="inline-flex shrink-0 h-9 items-center justify-center whitespace-nowrap rounded-xl border-2 border-donamed-primary bg-white px-4 text-xs font-semibold text-donamed-primary transition hover:bg-[#F7F7F7]"
                                    >
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No se encontraron categorías
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
