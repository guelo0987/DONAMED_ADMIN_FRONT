import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { personaService } from "@/services/personaService";
import type { Persona } from "@/types/persona.types";

function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function DetallePersona() {
    const navigate = useNavigate();
    const { cedula } = useParams();
    const [persona, setPersona] = useState<Persona | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!cedula) return;
        personaService
            .getPersonaByCedula(decodeURIComponent(cedula))
            .then(setPersona)
            .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar"))
            .finally(() => setIsLoading(false));
    }, [cedula]);

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-donamed-light border-t-donamed-primary" />
                    <p className="text-sm text-[#5B5B5B]">Cargando persona...</p>
                </div>
            </div>
        );
    }

    if (error || !persona) {
        return (
            <div className="space-y-6">
                <button
                    type="button"
                    onClick={() => navigate("/personas")}
                    className="inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a personas
                </button>
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error ?? "Persona no encontrada"}
                </div>
            </div>
        );
    }

    const nombreCompleto = `${persona.nombre} ${persona.apellidos}`.trim();

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/personas")}
                        className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                    >
                        ← Volver a personas
                    </button>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                        Detalle de Persona
                    </h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Información personal según tabla persona.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        asChild
                        variant="outline"
                        className="h-10 rounded-xl border-2 border-donamed-primary text-donamed-primary"
                    >
                        <Link to={`/personas/${encodeURIComponent(persona.cedula)}/editar`}>
                            Editar
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-6">
                    <div className="mb-6 flex flex-wrap items-center gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Cédula
                            </p>
                            <p className="mt-1 text-lg font-semibold text-[#1E1E1E]">
                                {persona.cedula}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Nombre completo
                            </p>
                            <p className="mt-1 text-lg font-semibold text-[#1E1E1E]">
                                {nombreCompleto}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Nombres
                            </span>
                            <span className="text-[#2D3748]">{persona.nombre}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Apellidos
                            </span>
                            <span className="text-[#2D3748]">{persona.apellidos}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Sexo
                            </span>
                            <span className="text-[#2D3748]">
                                {persona.sexo === "M" ? "Masculino" : persona.sexo === "F" ? "Femenino" : "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Fecha de nacimiento
                            </span>
                            <span className="text-[#2D3748]">
                                {formatDate(persona.fecha_nacimiento)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Teléfono
                            </span>
                            <span className="text-[#2D3748]">{persona.telefono ?? "—"}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Teléfono alternativo
                            </span>
                            <span className="text-[#2D3748]">
                                {persona.telefono_alternativo ?? "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm md:col-span-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Dirección
                            </span>
                            <span className="text-[#2D3748]">{persona.direccion ?? "—"}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Ciudad
                            </span>
                            <span className="text-[#2D3748]">
                                {persona.ciudad?.nombre ?? persona.codigociudad ?? "—"}
                            </span>
                        </div>
                    </div>

                    {persona.ciudad?.provincia && (
                        <div className="mt-4 flex flex-col gap-1 text-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                Provincia
                            </span>
                            <span className="text-[#2D3748]">
                                {persona.ciudad.provincia.nombre}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
