import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { personaService } from "@/services/personaService";

export function EditarPersona() {
    const navigate = useNavigate();
    const { cedula } = useParams();
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [sexo, setSexo] = useState<"M" | "F" | "">("");
    const [fecha_nacimiento, setFecha_nacimiento] = useState("");
    const [telefono, setTelefono] = useState("");
    const [telefono_alternativo, setTelefono_alternativo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [codigociudad, setCodigociudad] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!cedula) return;
        const cedulaDecoded = decodeURIComponent(cedula);
        personaService
            .getPersonaByCedula(cedulaDecoded)
            .then((p) => {
                setNombre(p.nombre);
                setApellidos(p.apellidos);
                setSexo(p.sexo || "");
                setFecha_nacimiento(p.fecha_nacimiento ? p.fecha_nacimiento.slice(0, 10) : "");
                setTelefono(p.telefono || "");
                setTelefono_alternativo(p.telefono_alternativo || "");
                setDireccion(p.direccion || "");
                setCodigociudad(p.codigociudad || "");
            })
            .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar"))
            .finally(() => setIsLoading(false));
    }, [cedula]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cedula) return;
        setError("");
        setIsSaving(true);
        try {
            await personaService.updatePersona(decodeURIComponent(cedula), {
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
                sexo: sexo || undefined,
                fecha_nacimiento: fecha_nacimiento || undefined,
                telefono: telefono.trim() || undefined,
                telefono_alternativo: telefono_alternativo.trim() || undefined,
                direccion: direccion.trim() || undefined,
                codigociudad: codigociudad.trim() || undefined,
            });
            navigate(`/personas/${encodeURIComponent(cedula)}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al actualizar");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !nombre) {
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
                    onClick={() => navigate(`/personas/${cedula}`)}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a la persona
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Editar persona
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Actualiza los datos de la persona. La cédula no se puede modificar.
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
                            Cédula: <span className="font-semibold text-[#2D3748]">{cedula}</span> (no editable)
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Apellidos *
                                </label>
                                <input
                                    type="text"
                                    value={apellidos}
                                    onChange={(e) => setApellidos(e.target.value)}
                                    required
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Sexo
                                </label>
                                <select
                                    value={sexo}
                                    onChange={(e) => setSexo(e.target.value as "M" | "F" | "")}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Fecha de nacimiento
                                </label>
                                <input
                                    type="date"
                                    value={fecha_nacimiento}
                                    onChange={(e) => setFecha_nacimiento(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Teléfono alternativo
                                </label>
                                <input
                                    type="tel"
                                    value={telefono_alternativo}
                                    onChange={(e) => setTelefono_alternativo(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm md:col-span-2">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Código ciudad
                                </label>
                                <input
                                    type="text"
                                    value={codigociudad}
                                    onChange={(e) => setCodigociudad(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl"
                        onClick={() => navigate(`/personas/${cedula}`)}
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
