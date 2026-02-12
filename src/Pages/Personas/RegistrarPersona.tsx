import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { personaService } from "@/services/personaService";
import { ubicacionService } from "@/services/ubicacionService";
import { useToast } from "@/contexts/ToastContext";
import type { Provincia, Ciudad } from "@/types/persona.types";

export function RegistrarPersona() {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [cedula, setCedula] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [sexo, setSexo] = useState<"M" | "F" | "">("");
    const [fecha_nacimiento, setFecha_nacimiento] = useState("");
    const [telefono, setTelefono] = useState("");
    const [telefono_alternativo, setTelefono_alternativo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [codigoprovincia, setCodigoprovincia] = useState("");
    const [codigociudad, setCodigociudad] = useState("");
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        ubicacionService.getProvincias().then(setProvincias).catch(() => setProvincias([]));
    }, []);

    useEffect(() => {
        if (!codigoprovincia) {
            setCiudades([]);
            setCodigociudad("");
            return;
        }
        ubicacionService
            .getCiudades(codigoprovincia)
            .then(setCiudades)
            .catch(() => setCiudades([]));
        setCodigociudad("");
    }, [codigoprovincia]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await personaService.createPersona({
                cedula: cedula.trim(),
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
                sexo: sexo || undefined,
                fecha_nacimiento: fecha_nacimiento || undefined,
                telefono: telefono.trim() || undefined,
                telefono_alternativo: telefono_alternativo.trim() || undefined,
                direccion: direccion.trim() || undefined,
                codigociudad: codigociudad.trim() || undefined,
            });
            addToast({ variant: "success", title: "Persona registrada", message: `${nombre.trim()} ${apellidos.trim()} fue creada correctamente.` });
            navigate("/personas");
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error al crear persona";
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
                    onClick={() => navigate("/personas")}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a personas
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Registrar persona
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Completa los datos según tabla persona.
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
                                    Cédula *
                                </label>
                                <input
                                    type="text"
                                    value={cedula}
                                    onChange={(e) => setCedula(e.target.value)}
                                    required
                                    maxLength={11}
                                    placeholder="0912345678"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                    placeholder="Juan"
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
                                    placeholder="Pérez García"
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
                                    placeholder="0991234567"
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
                                    placeholder="022345678"
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
                                    placeholder="Av. Principal 123"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Provincia
                                </label>
                                <select
                                    value={codigoprovincia}
                                    onChange={(e) => setCodigoprovincia(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Seleccionar provincia</option>
                                    {provincias.map((p) => (
                                        <option key={p.codigoprovincia} value={p.codigoprovincia}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Ciudad
                                </label>
                                <select
                                    value={codigociudad}
                                    onChange={(e) => setCodigociudad(e.target.value)}
                                    disabled={!codigoprovincia}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light disabled:bg-gray-50 disabled:text-gray-400"
                                >
                                    <option value="">Seleccionar ciudad</option>
                                    {ciudades.map((c) => (
                                        <option key={c.codigociudad} value={c.codigociudad}>
                                            {c.nombre}
                                        </option>
                                    ))}
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
                        onClick={() => navigate("/personas")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="h-11 rounded-xl bg-donamed-primary hover:bg-donamed-dark disabled:opacity-70"
                    >
                        {isLoading ? "Guardando..." : "Guardar persona"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
