import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EstadoProveedor = "Activo" | "Inactivo";

interface Proveedor {
    id: string;
    nombre: string;
    contacto: string;
    telefono: string;
    correo: string;
    estado: EstadoProveedor;
}

const proveedoresData: Proveedor[] = [
    {
        id: "PR-1001",
        nombre: "Laboratorios Sanar",
        contacto: "Laura Perez",
        telefono: "+57 300 555 1122",
        correo: "contacto@sanar.com",
        estado: "Activo",
    },
    {
        id: "PR-1002",
        nombre: "FarmaPlus",
        contacto: "Carlos Mendez",
        telefono: "+57 310 444 8899",
        correo: "info@farmaplus.com",
        estado: "Activo",
    },
    {
        id: "PR-1003",
        nombre: "Clinica Horizonte",
        contacto: "Diana Ruiz",
        telefono: "+57 312 555 2233",
        correo: "gestion@horizonte.com",
        estado: "Inactivo",
    },
];

const estadoStyles: Record<EstadoProveedor, string> = {
    Activo: "bg-success-light text-success",
    Inactivo: "bg-warning-light text-warning",
};

export function ListaProveedores() {
    const [proveedores] = useState(proveedoresData);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        return proveedores.filter((item) => {
            if (search.trim() === "") return true;
            const value = search.toLowerCase();
            return (
                item.nombre.toLowerCase().includes(value) ||
                item.contacto.toLowerCase().includes(value) ||
                item.correo.toLowerCase().includes(value)
            );
        });
    }, [proveedores, search]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Proveedores</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Gestion de proveedores y estado operativo.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                >
                    <Link to="/proveedores/nuevo">Registrar proveedor</Link>
                </Button>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <input
                            type="text"
                            placeholder="Buscar proveedor"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-full rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                        />
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr_0.9fr_1fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Proveedor</span>
                            <span>Contacto</span>
                            <span>Telefono</span>
                            <span>Correo</span>
                            <span>Estado</span>
                            <span>Acciones</span>
                        </div>

                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr_0.9fr_1fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{item.nombre}</span>
                                    <span className="text-xs text-[#5B5B5B]/70">{item.id}</span>
                                </div>
                                <span>{item.contacto}</span>
                                <span>{item.telefono}</span>
                                <span>{item.correo}</span>
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${estadoStyles[item.estado]}`}
                                >
                                    {item.estado}
                                </span>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Link
                                        to={`/proveedores/${item.id}`}
                                        className="inline-flex h-9 items-center justify-center rounded-xl bg-donamed-primary px-4 text-xs font-semibold text-white transition hover:bg-donamed-dark"
                                    >
                                        Ver detalle
                                    </Link>
                                    <Link
                                        to={`/proveedores/${item.id}/editar`}
                                        className="inline-flex h-9 items-center justify-center rounded-xl border-2 border-donamed-primary bg-white px-4 text-xs font-semibold text-donamed-primary transition hover:bg-[#F7F7F7]"
                                    >
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No se encontraron proveedores
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
