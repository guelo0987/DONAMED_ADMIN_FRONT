import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { donacionService } from "@/services/donacionService";
import { proveedorService } from "@/services/proveedorService";
import { useToast } from "@/contexts/ToastContext";
import type { Proveedor } from "@/types/proveedor.types";

export function EditarDonacion() {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const { id } = useParams();
    const [proveedor, setProveedor] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        const num = parseInt(id, 10);
        if (isNaN(num)) return;
        donacionService
            .getDonacionById(num)
            .then((d) => {
                setProveedor(d.proveedor ?? "");
                setDescripcion(d.descripcion ?? "");
            })
            .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar"))
            .finally(() => setIsLoading(false));
    }, [id]);

    useEffect(() => {
        proveedorService.getProveedores({ limit: 500 }).then((r) => setProveedores(r.data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setError("");
        setIsSaving(true);
        try {
            await donacionService.updateDonacion(parseInt(id, 10), {
                proveedor: proveedor.trim() || undefined,
                descripcion: descripcion.trim() || undefined,
            });
            addToast({ variant: "success", title: "Donación actualizada", message: "Los datos fueron actualizados correctamente." });
            navigate(`/donaciones/${id}`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error al actualizar";
            setError(msg);
            addToast({ variant: "error", title: "Error", message: msg });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
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
                    onClick={() => navigate(`/donaciones/${id}`)}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a la donación
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">Editar Donación</h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Actualiza proveedor y descripción. Los medicamentos se gestionan desde el detalle.
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
                            Donación #{id}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Proveedor / Donante
                                </label>
                                <select
                                    value={proveedor}
                                    onChange={(e) => setProveedor(e.target.value)}
                                    className="h-11 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Sin proveedor</option>
                                    {proveedores.map((p) => (
                                        <option key={p.rncproveedor} value={p.rncproveedor}>
                                            {p.nombre} ({p.rncproveedor})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm md:col-span-2">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Descripción / Observaciones
                                </label>
                                <textarea
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    className="min-h-[120px] rounded-lg border border-[#E7E7E7] px-3 py-2 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
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
                        onClick={() => navigate(`/donaciones/${id}`)}
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
