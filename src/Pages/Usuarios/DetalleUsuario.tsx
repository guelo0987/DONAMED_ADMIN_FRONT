import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usuarioService } from "@/services/usuarioService";
import type { Usuario, EstadoUsuario } from "@/types/usuario.types";

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
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const num = parseInt(id, 10);
        if (isNaN(num)) {
            setError("ID inválido");
            setIsLoading(false);
            return;
        }
        usuarioService
            .getUsuarioById(num)
            .then(setUsuario)
            .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar"))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-donamed-light border-t-donamed-primary" />
                    <p className="text-sm text-[#5B5B5B]">Cargando usuario...</p>
                </div>
            </div>
        );
    }

    if (error || !usuario) {
        return (
            <div className="space-y-6">
                <button
                    type="button"
                    onClick={() => navigate("/usuarios")}
                    className="inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a usuarios
                </button>
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error ?? "Usuario no encontrado"}
                </div>
            </div>
        );
    }

    const nombreCompleto = usuario.persona
        ? `${usuario.persona.nombre} ${usuario.persona.apellidos}`.trim()
        : null;

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
                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${usuario.estado ? statusStyles[usuario.estado] : "bg-gray-100 text-gray-600"}`}
                        >
                            {usuario.estado ? estadoLabels[usuario.estado] : "—"}
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
                            <span className="text-[#2D3748]">{usuario.cedula_usuario ?? "—"}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Rol
                            </span>
                            <span className="text-[#2D3748]">{usuario.rol?.nombre ?? "—"}</span>
                        </div>
                        {nombreCompleto && (
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Nombre completo
                                </span>
                                <span className="text-[#2D3748]">{nombreCompleto}</span>
                            </div>
                        )}
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
                        {usuario.persona?.telefono && (
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Teléfono
                                </span>
                                <span className="text-[#2D3748]">{usuario.persona.telefono}</span>
                            </div>
                        )}
                        {usuario.persona?.direccion && (
                            <div className="flex flex-col gap-1 text-sm md:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Dirección
                                </span>
                                <span className="text-[#2D3748]">{usuario.persona.direccion}</span>
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
