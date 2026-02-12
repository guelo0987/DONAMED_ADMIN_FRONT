import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usuarioService } from "@/services/usuarioService";
import { catalogoService } from "@/services/catalogoService";
import { useToast } from "@/contexts/ToastContext";
import type { Rol } from "@/types/persona.types";

export function RegistrarUsuario() {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [roles, setRoles] = useState<Rol[]>([]);
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [cedula_usuario, setCedula_usuario] = useState("");
    const [codigo_rol, setCodigo_rol] = useState<number>(1);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        catalogoService
            .getRoles()
            .then((list) => {
                setRoles(list);
                if (list.length > 0) setCodigo_rol(list[0].codigorol);
            })
            .catch(() => setRoles([]));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await usuarioService.createUsuario({
                correo: correo.trim(),
                contrasena,
                cedula_usuario: cedula_usuario.trim() || undefined,
                codigo_rol: roles.length ? codigo_rol : undefined,
            });
            addToast({ variant: "success", title: "Usuario registrado", message: `${correo.trim()} fue creado correctamente.` });
            navigate("/usuarios");
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error al crear usuario";
            setError(msg);
            addToast({ variant: "error", title: "Error", message: msg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/usuarios")}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a usuarios
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Registrar usuario
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Completa los datos según tabla usuario y rol. La cédula debe existir en Personas.
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
                                    placeholder="usuario@donamed.org"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Contraseña *
                                </label>
                                <input
                                    type="password"
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Cédula (persona existente)
                                </label>
                                <input
                                    type="text"
                                    value={cedula_usuario}
                                    onChange={(e) => setCedula_usuario(e.target.value)}
                                    maxLength={11}
                                    placeholder="0912345678"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Rol *
                                </label>
                                <select
                                    value={roles.length ? codigo_rol : ""}
                                    onChange={(e) => setCodigo_rol(Number(e.target.value))}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    {roles.length === 0 ? (
                                        <option value="">Cargando roles...</option>
                                    ) : (
                                        roles.map((r) => (
                                            <option key={r.codigorol} value={r.codigorol}>
                                                {r.nombre}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl"
                        onClick={() => navigate("/usuarios")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="h-11 rounded-xl bg-donamed-primary hover:bg-donamed-dark disabled:opacity-70"
                    >
                        {isLoading ? "Guardando..." : "Guardar usuario"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
