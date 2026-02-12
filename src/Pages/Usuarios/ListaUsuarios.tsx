import { useMemo, useState } from "react";
import { Search, Eye, ChevronDown, Plus, PencilLine, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Estados según tipo_estado_general de la DB
type EstadoUsuario = "ACTIVO" | "INACTIVO" | "ELIMINADO";

interface Usuario {
    idusuario: number;
    correo: string;
    cedula_usuario: string;
    codigo_rol: number;
    ultimo_ingreso: string | null;
    creado_en: string;
    actualizado_en: string;
    estado: EstadoUsuario;
    foto_url: string | null;
    nombreRol?: string;
}

// Datos de ejemplo alineados con tabla usuario
const usuariosData: Usuario[] = [
    {
        idusuario: 1,
        correo: "admin@donamed.org",
        cedula_usuario: "0912345678",
        codigo_rol: 1,
        ultimo_ingreso: "2025-02-11T08:30:00",
        creado_en: "2024-01-10T10:00:00",
        actualizado_en: "2025-02-11T08:30:00",
        estado: "ACTIVO",
        foto_url: null,
        nombreRol: "Administrador",
    },
    {
        idusuario: 2,
        correo: "maria.carmen@donamed.org",
        cedula_usuario: "0801234567",
        codigo_rol: 2,
        ultimo_ingreso: "2025-02-10T14:20:00",
        creado_en: "2024-03-15T09:00:00",
        actualizado_en: "2025-02-10T14:20:00",
        estado: "ACTIVO",
        foto_url: null,
        nombreRol: "Coordinador",
    },
    {
        idusuario: 3,
        correo: "luis.andrade@donamed.org",
        cedula_usuario: "1723456789",
        codigo_rol: 3,
        ultimo_ingreso: "2025-02-09T11:45:00",
        creado_en: "2024-05-20T11:00:00",
        actualizado_en: "2025-02-09T11:45:00",
        estado: "ACTIVO",
        foto_url: null,
        nombreRol: "Operador",
    },
    {
        idusuario: 4,
        correo: "ana.perez@donamed.org",
        cedula_usuario: "1751234567",
        codigo_rol: 3,
        ultimo_ingreso: null,
        creado_en: "2025-01-05T08:00:00",
        actualizado_en: "2025-01-05T08:00:00",
        estado: "INACTIVO",
        foto_url: null,
        nombreRol: "Operador",
    },
];

const statusStyles: Record<EstadoUsuario, string> = {
    ACTIVO: "bg-success-light text-success",
    INACTIVO: "bg-warning-light text-warning",
    ELIMINADO: "bg-danger-light text-danger",
};

const estadoLabels: Record<EstadoUsuario, string> = {
    ACTIVO: "Activo",
    INACTIVO: "Inactivo",
    ELIMINADO: "Eliminado",
};

function formatDateTime(dateStr: string | null): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function ListaUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>(() => [...usuariosData]);
    const [searchTerm, setSearchTerm] = useState("");
    const [estado, setEstado] = useState<EstadoUsuario | "all">("all");
    const [rol, setRol] = useState<string>("all");
    const [showFilters, setShowFilters] = useState(false);
    const [eliminarTarget, setEliminarTarget] = useState<Usuario | null>(null);

    const handleEliminar = () => {
        if (!eliminarTarget) return;
        setUsuarios((prev) => prev.filter((u) => u.idusuario !== eliminarTarget.idusuario));
        setEliminarTarget(null);
    };

    const filteredUsuarios = useMemo(() => {
        return usuarios.filter((u) => {
            const matchesSearch =
                searchTerm.trim() === "" ||
                u.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.cedula_usuario.includes(searchTerm) ||
                (u.nombreRol?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
            const matchesEstado = estado === "all" || u.estado === estado;
            const matchesRol =
                rol === "all" || (u.nombreRol?.toLowerCase() === rol.toLowerCase());

            return matchesSearch && matchesEstado && matchesRol;
        });
    }, [usuarios, searchTerm, estado, rol]);

    const rolesUnicos = useMemo(() => {
        const set = new Set(usuarios.map((u) => u.nombreRol).filter(Boolean));
        return Array.from(set) as string[];
    }, [usuarios]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Usuarios</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Gestión de usuarios del sistema según rol y estado.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-10 gap-2 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                >
                    <Link to="/usuarios/nuevo">
                        <Plus className="h-4 w-4" />
                        Nuevo usuario
                    </Link>
                </Button>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <div className="flex items-center gap-3 text-sm text-[#5B5B5B]/80">
                            <span className="rounded-full bg-donamed-light px-3 py-1 text-xs font-semibold text-donamed-dark">
                                {filteredUsuarios.length} resultados
                            </span>
                            <span>Usuarios registrados</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex h-10 items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-4 text-sm font-medium text-[#5B5B5B] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <span>Filtros</span>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                                />
                            </button>
                            <div className="group flex h-11 w-[280px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                                    <Search className="h-4 w-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por correo, cédula o rol"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="border-b border-[#EEF1F4] bg-white px-6 py-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="flex flex-col gap-2 text-sm">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                        Estado
                                    </span>
                                    <select
                                        value={estado}
                                        onChange={(e) =>
                                            setEstado(e.target.value as EstadoUsuario | "all")
                                        }
                                        className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    >
                                        <option value="all">Todos</option>
                                        {(Object.keys(estadoLabels) as EstadoUsuario[]).map(
                                            (e) => (
                                                <option key={e} value={e}>
                                                    {estadoLabels[e]}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 text-sm">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                        Rol
                                    </span>
                                    <select
                                        value={rol}
                                        onChange={(e) => setRol(e.target.value)}
                                        className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    >
                                        <option value="all">Todos</option>
                                        {rolesUnicos.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="w-full">
                        <div className="grid grid-cols-[0.6fr_1.4fr_1fr_1fr_1.2fr_0.9fr_0.8fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>ID</span>
                            <span>Correo</span>
                            <span>Cédula</span>
                            <span>Rol</span>
                            <span>Último ingreso</span>
                            <span>Estado</span>
                            <span>Acciones</span>
                        </div>

                        {filteredUsuarios.map((usuario) => (
                            <div
                                key={usuario.idusuario}
                                className="grid grid-cols-[0.6fr_1.4fr_1fr_1fr_1.2fr_0.9fr_0.8fr] gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <span className="font-medium">{usuario.idusuario}</span>
                                <span>{usuario.correo}</span>
                                <span>{usuario.cedula_usuario}</span>
                                <span>{usuario.nombreRol}</span>
                                <span>{formatDateTime(usuario.ultimo_ingreso)}</span>
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[usuario.estado]}`}
                                >
                                    {estadoLabels[usuario.estado]}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/usuarios/${usuario.idusuario}`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                        title="Ver detalle"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        to={`/usuarios/${usuario.idusuario}/editar`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                        title="Editar"
                                    >
                                        <PencilLine className="h-4 w-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setEliminarTarget(usuario)}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-danger transition hover:border-danger/40 hover:bg-danger/5"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredUsuarios.length === 0 && (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No se encontraron usuarios
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {eliminarTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-[0px_30px_80px_-40px_rgba(0,0,0,0.6)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Eliminar usuario
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-[#1E1E1E]">
                                    {eliminarTarget.correo}
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
