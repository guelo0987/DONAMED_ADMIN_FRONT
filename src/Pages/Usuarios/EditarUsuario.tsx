import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const roles = [
    { codigo: 1, nombre: "Administrador" },
    { codigo: 2, nombre: "Coordinador" },
    { codigo: 3, nombre: "Operador" },
];

export function EditarUsuario() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [correo, setCorreo] = useState("admin@donamed.org");
    const [cambiarContraseña, setCambiarContraseña] = useState(false);
    const [nuevaContraseña, setNuevaContraseña] = useState("");
    const [cedula_usuario, setCedula_usuario] = useState("0912345678");
    const [codigo_rol, setCodigo_rol] = useState(1);
    const [estado, setEstado] = useState<"ACTIVO" | "INACTIVO">("ACTIVO");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Llamar API para actualizar
        navigate(`/usuarios/${id}`);
    };

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
                                    Cédula *
                                </label>
                                <input
                                    type="text"
                                    value={cedula_usuario}
                                    onChange={(e) => setCedula_usuario(e.target.value)}
                                    required
                                    maxLength={11}
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
                                        <option key={r.codigo} value={r.codigo}>
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
                                        checked={cambiarContraseña}
                                        onChange={(e) => setCambiarContraseña(e.target.checked)}
                                        className="h-4 w-4 rounded border-[#E7E7E7]"
                                    />
                                    <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                        Cambiar contraseña
                                    </span>
                                </label>
                                {cambiarContraseña && (
                                    <input
                                        type="password"
                                        value={nuevaContraseña}
                                        onChange={(e) => setNuevaContraseña(e.target.value)}
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
                    <Button type="submit" className="h-11 rounded-xl bg-donamed-primary hover:bg-donamed-dark">
                        Guardar cambios
                    </Button>
                </div>
            </form>
        </div>
    );
}
