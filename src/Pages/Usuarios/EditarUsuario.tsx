import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usuarioService } from "@/services/usuarioService";
import { catalogoService } from "@/services/catalogoService";
import type { Rol } from "@/types/persona.types";

export function EditarUsuario() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [roles, setRoles] = useState<Rol[]>([]);
    const [correo, setCorreo] = useState("");
    const [cambiarContrasena, setCambiarContrasena] = useState(false);
    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [codigo_rol, setCodigo_rol] = useState<number>(1);
    const [estado, setEstado] = useState<"ACTIVO" | "INACTIVO">("ACTIVO");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        catalogoService.getRoles().then(setRoles).catch(() => setRoles([]));
    }, []);

    useEffect(() => {
        if (!id) return;
        const num = parseInt(id, 10);
        if (isNaN(num)) return;
        usuarioService
            .getUsuarioById(num)
            .then((u) => {
                setCorreo(u.correo);
                setCodigo_rol(u.codigo_rol ?? 1);
                setEstado(
                    (u.estado === "ACTIVO" || u.estado === "INACTIVO" ? u.estado : "ACTIVO") as
                        | "ACTIVO"
                        | "INACTIVO"
                );
            })
            .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar"))
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setError("");
        setIsSaving(true);
        const num = parseInt(id, 10);
        try {
            const payload: { correo?: string; contrasena?: string; codigo_rol?: number; estado?: "ACTIVO" | "INACTIVO" } = {
                correo: correo.trim(),
                codigo_rol,
                estado,
            };
            if (cambiarContrasena && nuevaContrasena) {
                payload.contrasena = nuevaContrasena;
            }
            await usuarioService.updateUsuario(num, payload);
            navigate(`/usuarios/${id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al actualizar");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !correo) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-donamed-light border-t-donamed-primary" />
                    <p className="text-sm text-[#5B5B5B]">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate(`/usuarios/${id}`)}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver al usuario
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Editar usuario
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Actualiza los datos del usuario {id}.
                </p>
            </div>

            {error && (
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <div className="mb-4 rounded-lg border border-[#E7E7E7] bg-[#FBFBFC] px-4 py-3 text-sm text-[#5B5B5B]">
                            ID: <span className="font-semibold text-[#2D3748]">{id}</span> (no editable)
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Correo *
                                </label>
                                <input
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    required
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Rol *
                                </label>
                                <select
                                    value={codigo_rol}
                                    onChange={(e) => setCodigo_rol(Number(e.target.value))}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    {roles.map((r) => (
                                        <option key={r.codigorol} value={r.codigorol}>
                                            {r.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Estado
                                </label>
                                <select
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value as "ACTIVO" | "INACTIVO")}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="ACTIVO">Activo</option>
                                    <option value="INACTIVO">Inactivo</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm md:col-span-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={cambiarContrasena}
                                        onChange={(e) => setCambiarContrasena(e.target.checked)}
                                        className="h-4 w-4 rounded border-[#E7E7E7]"
                                    />
                                    <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                        Cambiar contraseña
                                    </span>
                                </label>
                                {cambiarContrasena && (
                                    <input
                                        type="password"
                                        value={nuevaContrasena}
                                        onChange={(e) => setNuevaContrasena(e.target.value)}
                                        placeholder="Nueva contraseña"
                                        className="mt-2 h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl"
                        onClick={() => navigate(`/usuarios/${id}`)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-11 rounded-xl bg-donamed-primary hover:bg-donamed-dark disabled:opacity-70"
                    >
                        {isSaving ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
