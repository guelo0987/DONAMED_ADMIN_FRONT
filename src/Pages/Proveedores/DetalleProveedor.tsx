import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { proveedorService } from "@/services/proveedorService";
import type { Proveedor, ProveedorStats } from "@/types/proveedor.types";

export function DetalleProveedor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [proveedor, setProveedor] = useState<Proveedor | null>(null);
    const [stats, setStats] = useState<ProveedorStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const rnc = decodeURIComponent(id);
        proveedorService
            .getProveedorById(rnc)
            .then(setProveedor)
            .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar"))
            .finally(() => setIsLoading(false));

        proveedorService.getProveedorStats(rnc).then(setStats).catch(() => setStats(null));
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-donamed-light border-t-donamed-primary" />
                    <p className="text-sm text-[#5B5B5B]">Cargando proveedor...</p>
                </div>
            </div>
        );
    }

    if (error || !proveedor) {
        return (
            <div className="space-y-6">
                <button
                    type="button"
                    onClick={() => navigate("/proveedores")}
                    className="inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a proveedores
                </button>
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error ?? "Proveedor no encontrado"}
                </div>
            </div>
        );
    }

    const nombreCiudad =
        proveedor.ciudad?.nombre ?? proveedor.codigociudad ?? "—";

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/proveedores")}
                        className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                    >
                        ← Volver a proveedores
                    </button>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                        Detalle del proveedor
                    </h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Información general y estadísticas de donaciones.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        asChild
                        variant="outline"
                        className="h-10 rounded-xl border-2 border-donamed-primary text-donamed-primary"
                    >
                        <Link
                            to={`/proveedores/${encodeURIComponent(proveedor.rncproveedor)}/editar`}
                        >
                            Editar
                        </Link>
                    </Button>
                </div>
            </div>

            {stats && (
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            Estadísticas
                        </p>
                        <div className="mt-4 flex flex-wrap gap-6">
                            <div className="rounded-xl bg-donamed-light/30 px-4 py-3">
                                <p className="text-2xl font-bold text-donamed-dark">
                                    {stats.estadisticas.totalDonaciones}
                                </p>
                                <p className="text-sm text-[#5B5B5B]">Total donaciones</p>
                            </div>
                            <div className="rounded-xl bg-donamed-light/30 px-4 py-3">
                                <p className="text-2xl font-bold text-donamed-dark">
                                    {stats.estadisticas.totalMedicamentosDonados}
                                </p>
                                <p className="text-sm text-[#5B5B5B]">Medicamentos donados</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                RNC
                            </span>
                            <span className="text-[#2D3748] font-medium">
                                {proveedor.rncproveedor}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Nombre
                            </span>
                            <span className="text-[#2D3748]">{proveedor.nombre}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Teléfono
                            </span>
                            <span className="text-[#2D3748]">
                                {proveedor.telefono ?? "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Correo
                            </span>
                            <span className="text-[#2D3748]">
                                {proveedor.correo ?? "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Ciudad
                            </span>
                            <span className="text-[#2D3748]">{nombreCiudad}</span>
                        </div>
                        {proveedor.ciudad?.provincia && (
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Provincia
                                </span>
                                <span className="text-[#2D3748]">
                                    {proveedor.ciudad.provincia.nombre}
                                </span>
                            </div>
                        )}
                        <div className="flex flex-col gap-1 text-sm md:col-span-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Dirección
                            </span>
                            <span className="text-[#2D3748]">
                                {proveedor.direccion ?? "—"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
