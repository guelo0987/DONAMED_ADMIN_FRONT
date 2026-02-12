import { useCallback, useEffect, useState } from "react";
import { Search, Eye, ChevronDown, Plus, PencilLine } from "lucide-react";
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

export function ListaPersonas() {
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });

    const fetchPersonas = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await personaService.getPersonas({
                page,
                limit: 20,
                search: searchQuery || undefined,
            });
            setPersonas(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar personas");
            setPersonas([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchPersonas(1);
    }, [fetchPersonas]);

    const handleSearch = () => {
        setSearchQuery(searchTerm);
    };

    const nombreCompleto = (p: Persona) => `${p.nombre} ${p.apellidos}`.trim();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Personas</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Gestión de personas. Las personas pueden vincularse a usuarios.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-10 gap-2 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                >
                    <Link to="/personas/nueva">
                        <Plus className="h-4 w-4" />
                        Nueva persona
                    </Link>
                </Button>
            </div>

            {error && (
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error}
                </div>
            )}

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <div className="flex items-center gap-3 text-sm text-[#5B5B5B]/80">
                            <span className="rounded-full bg-donamed-light px-3 py-1 text-xs font-semibold text-donamed-dark">
                                {pagination.total} resultados
                            </span>
                            <span>Personas registradas</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex h-10 items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-4 text-sm font-medium text-[#5B5B5B] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <span>Filtros</span>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                                />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="group flex h-11 w-[280px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                                        <Search className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Buscar por cédula, nombre o apellidos"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                        className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleSearch}
                                    className="h-11 rounded-xl bg-donamed-primary px-4 text-white hover:bg-donamed-dark"
                                >
                                    Buscar
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[1fr_1.5fr_1fr_0.8fr_1fr_0.8fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Cédula</span>
                            <span>Nombre completo</span>
                            <span>Teléfono</span>
                            <span>Sexo</span>
                            <span>Fecha nacimiento</span>
                            <span>Acciones</span>
                        </div>

                        {isLoading ? (
                            <div className="py-16 text-center">
                                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-donamed-light border-t-donamed-primary" />
                                <p className="mt-3 text-sm text-[#5B5B5B]">Cargando personas...</p>
                            </div>
                        ) : (
                            <>
                                {personas.map((persona) => (
                                    <div
                                        key={persona.cedula}
                                        className="grid grid-cols-[1fr_1.5fr_1fr_0.8fr_1fr_0.8fr] gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                    >
                                        <span className="font-medium">{persona.cedula}</span>
                                        <span>{nombreCompleto(persona)}</span>
                                        <span>{persona.telefono ?? "—"}</span>
                                        <span>{persona.sexo === "M" ? "M" : persona.sexo === "F" ? "F" : "—"}</span>
                                        <span>{formatDate(persona.fecha_nacimiento)}</span>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/personas/${encodeURIComponent(persona.cedula)}`}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                                title="Ver detalle"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                to={`/personas/${encodeURIComponent(persona.cedula)}/editar`}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                                title="Editar"
                                            >
                                                <PencilLine className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}

                                {personas.length === 0 && (
                                    <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                        No se encontraron personas
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
