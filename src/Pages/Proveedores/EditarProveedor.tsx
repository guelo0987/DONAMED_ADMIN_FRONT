import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { proveedorService } from "@/services/proveedorService";
import { ubicacionService } from "@/services/ubicacionService";
import { useToast } from "@/contexts/ToastContext";
import type { Provincia, Ciudad } from "@/types/persona.types";

export function EditarProveedor() {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [codigoprovincia, setCodigoprovincia] = useState("");
    const [codigociudad, setCodigociudad] = useState("");
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [direccion, setDireccion] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        const rnc = decodeURIComponent(id);
        proveedorService
            .getProveedorById(rnc)
            .then((p) => {
                setNombre(p.nombre);
                setTelefono(p.telefono || "");
                setCorreo(p.correo || "");
                const prov = p.ciudad?.codigoprovincia ?? p.ciudad?.provincia?.codigoprovincia ?? "";
                setCodigoprovincia(prov);
                setCodigociudad(p.codigociudad || "");
            })
            .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar"))
            .finally(() => setIsLoading(false));
    }, [id]);

    useEffect(() => {
        ubicacionService.getProvincias().then(setProvincias).catch(() => setProvincias([]));
    }, []);

    useEffect(() => {
        if (!codigoprovincia) {
            setCiudades([]);
            return;
        }
        ubicacionService
            .getCiudades(codigoprovincia)
            .then((cities) => {
                setCiudades(cities);
                setCodigociudad((prev) =>
                    prev && cities.some((c) => c.codigociudad === prev) ? prev : ""
                );
            })
            .catch(() => setCiudades([]));
    }, [codigoprovincia]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setError("");
        setIsSaving(true);
        try {
            await proveedorService.updateProveedor(decodeURIComponent(id), {
                nombre: nombre.trim(),
                telefono: telefono.trim() || undefined,
                correo: correo.trim() || undefined,
                codigociudad: codigociudad.trim() || undefined,
                direccion: direccion.trim() || undefined,
            });
            addToast({ variant: "success", title: "Proveedor actualizado", message: `${nombre.trim()} fue actualizado correctamente.` });
            navigate(`/proveedores/${id}`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error al actualizar";
            setError(msg);
            addToast({ variant: "error", title: "Error", message: msg });
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
                    onClick={() => navigate(`/proveedores/${id}`)}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver al proveedor
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Editar proveedor
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Actualiza la información. El RNC no se puede modificar.
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
                            RNC: <span className="font-semibold text-[#2D3748]">{id}</span> (no
                            editable)
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
                                    Correo
                                </label>
                                <input
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
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
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl"
                        onClick={() => navigate(`/proveedores/${id}`)}
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
