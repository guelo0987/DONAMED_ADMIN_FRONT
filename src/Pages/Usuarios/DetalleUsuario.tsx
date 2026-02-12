import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EstadoUsuario = "ACTIVO" | "INACTIVO" | "ELIMINADO";

interface UsuarioDetalle {
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

const detalleMock: UsuarioDetalle = {
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
};

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

export function DetalleUsuario() {
    const navigate = useNavigate();
    const { id } = useParams();

    const usuario = useMemo(() => {
        const num = id ? parseInt(id, 10) : detalleMock.idusuario;
        return { ...detalleMock, idusuario: num };
    }, [id]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/usuarios")}
                        className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                    >
                        ← Volver a usuarios
                    </button>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                        Detalle de Usuario
                    </h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Información del usuario según tabla usuario y rol.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        asChild
                        variant="outline"
                        className="h-10 rounded-xl border-2 border-donamed-primary text-donamed-primary"
                    >
                        <Link to={`/usuarios/${usuario.idusuario}/editar`}>Editar</Link>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-xl border-2 border-donamed-primary text-donamed-primary"
                    >
                        {usuario.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                ID de usuario
                            </p>
                            <p className="mt-1 text-lg font-semibold text-[#1E1E1E]">
                                {usuario.idusuario}
                            </p>
                        </div>
                        <span
                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[usuario.estado]}`}
                        >
                            {estadoLabels[usuario.estado]}
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Correo
                            </span>
                            <span className="text-[#2D3748]">{usuario.correo}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Cédula
                            </span>
                            <span className="text-[#2D3748]">{usuario.cedula_usuario}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Rol (codigo_rol)
                            </span>
                            <span className="text-[#2D3748]">{usuario.nombreRol}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Último ingreso
                            </span>
                            <span className="text-[#2D3748]">
                                {formatDateTime(usuario.ultimo_ingreso)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Fecha de creación
                            </span>
                            <span className="text-[#2D3748]">
                                {formatDateTime(usuario.creado_en)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Última actualización
                            </span>
                            <span className="text-[#2D3748]">
                                {formatDateTime(usuario.actualizado_en)}
                            </span>
                        </div>
                        {usuario.foto_url && (
                            <div className="flex flex-col gap-1 text-sm md:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Foto
                                </span>
                                <img
                                    src={usuario.foto_url}
                                    alt="Foto usuario"
                                    className="mt-2 h-20 w-20 rounded-full object-cover"
                                />
                            </div>
                        )}
                    </div>

                    <p className="mt-6 text-xs text-[#5B5B5B]/70">
                        Nota: el campo contraseña no se muestra por seguridad. Se gestiona solo al
                        crear o cambiar contraseña.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
