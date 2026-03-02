import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Truck, Loader2, Plus, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import { solicitudService } from "@/services/solicitudService";
import { despachoService } from "@/services/despachoService";
import { inventarioService, type InventarioItem } from "@/services/inventarioService";
import { personaService } from "@/services/personaService";
import type { Persona } from "@/types/persona.types";
import type { Solicitud } from "@/types/solicitud.types";

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-DO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function getSolicitanteNombre(s: Solicitud): string {
    const persona = s.usuario?.persona;
    if (persona) return `${persona.nombre} ${persona.apellidos}`;
    return s.usuario?.correo ?? "—";
}

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                {label}
            </span>
            <span className="text-[#2D3748]">{value || "—"}</span>
        </div>
    );
}

interface DetalleRow {
    key: number;
    inventarioKey: string;
    cantidad: number;
    dosis_indicada: string;
    tiempo_tratamiento: string;
}

export function CrearDespacho() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addToast } = useToast();
    const numerosolicitud = id ? parseInt(id, 10) : null;

    const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cedula, setCedula] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Personas para dropdown de quien recibe
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [personaSearch, setPersonaSearch] = useState("");
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

    // Inventario para asignar inline
    const [inventario, setInventario] = useState<InventarioItem[]>([]);
    const [isLoadingInventario, setIsLoadingInventario] = useState(false);
    const [detalleRows, setDetalleRows] = useState<DetalleRow[]>([]);
    const [rowKeyCounter, setRowKeyCounter] = useState(0);

    const tieneDetallesPrevios = (solicitud?.detalle_solicitud ?? []).length > 0;

    const filteredPersonas = useMemo(() => {
        if (!personaSearch.trim()) return personas;
        const q = personaSearch.toLowerCase();
        return personas.filter(
            (p) =>
                p.cedula.includes(q) ||
                p.nombre.toLowerCase().includes(q) ||
                p.apellidos.toLowerCase().includes(q)
        );
    }, [personas, personaSearch]);

    const fetchData = useCallback(async () => {
        if (!numerosolicitud) {
            setError("Número de solicitud no válido");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const [sol, personasResult] = await Promise.all([
                solicitudService.getSolicitudById(numerosolicitud),
                personaService.getPersonas({ limit: 500 }),
            ]);
            setSolicitud(sol);
            setPersonas(personasResult.data);

            // Si no tiene detalles pre-asignados, cargar inventario para asignarlos inline
            if ((sol.detalle_solicitud ?? []).length === 0) {
                setIsLoadingInventario(true);
                const items = await inventarioService.getInventario();
                setInventario(items.filter((i) => i.cantidad > 0));
                setIsLoadingInventario(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar la solicitud");
        } finally {
            setIsLoading(false);
        }
    }, [numerosolicitud]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ---- Rows helpers ----
    const addDetalleRow = () => {
        const nextKey = rowKeyCounter + 1;
        setRowKeyCounter(nextKey);
        setDetalleRows((prev) => [
            ...prev,
            { key: nextKey, inventarioKey: "", cantidad: 1, dosis_indicada: "", tiempo_tratamiento: "" },
        ]);
    };

    const removeDetalleRow = (key: number) => {
        setDetalleRows((prev) => prev.filter((r) => r.key !== key));
    };

    const updateDetalleRow = (key: number, field: keyof DetalleRow, value: string | number) => {
        setDetalleRows((prev) =>
            prev.map((r) => (r.key === key ? { ...r, [field]: value } : r))
        );
    };

    const getInventarioLabel = (item: InventarioItem) => {
        const medName = item.medicamento?.nombre ?? item.codigomedicamento;
        const almName = item.almacen?.nombre ?? `Almacén #${item.idalmacen}`;
        const loteCode = item.codigolote;
        const venc = item.lote?.fechavencimiento
            ? new Date(item.lote.fechavencimiento).toLocaleDateString("es-DO")
            : "";
        return `${medName} — Lote: ${loteCode}${venc ? ` (Vence: ${venc})` : ""} — ${almName} — Stock: ${item.cantidad}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!numerosolicitud) return;

        if (!cedula.trim()) {
            addToast({ variant: "error", title: "Error", message: "Debes ingresar la cédula de quien recibe" });
            return;
        }

        // Construir payload
        const payload: Parameters<typeof despachoService.createDespacho>[0] = {
            solicitud: numerosolicitud,
            cedula_recibe: cedula.trim(),
        };

        // Si no tiene detalles pre-asignados, enviar inline
        if (!tieneDetallesPrevios) {
            const validRows = detalleRows.filter(
                (r) => r.inventarioKey && r.cantidad > 0 && r.dosis_indicada.trim() && r.tiempo_tratamiento.trim()
            );
            if (validRows.length === 0) {
                addToast({ variant: "error", title: "Error", message: "Debes asignar al menos un medicamento del inventario con todos los campos completos." });
                return;
            }
            payload.detalles = validRows.map((r) => {
                const [idalmacen, codigolote] = r.inventarioKey.split("|");
                return {
                    idalmacen: parseInt(idalmacen, 10),
                    codigolote,
                    cantidad: r.cantidad,
                    dosis_indicada: r.dosis_indicada.trim(),
                    tiempo_tratamiento: r.tiempo_tratamiento.trim(),
                };
            });
        }

        setIsSubmitting(true);
        try {
            await despachoService.createDespacho(payload);
            addToast({ variant: "success", title: "Despacho creado", message: "El despacho fue creado exitosamente." });
            navigate("/despachos/historial");
        } catch (err) {
            addToast({ variant: "error", title: "Error", message: err instanceof Error ? err.message : "Error al crear despacho" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-donamed-primary" />
            </div>
        );
    }

    if (error || !solicitud) {
        return (
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => navigate("/despachos")}
                    className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver a despachos
                </button>
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error ?? "Solicitud no encontrada"}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/despachos")}
                    className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver a despachos
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">Crear Despacho</h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Confirma los datos y registra la persona que recibe.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Solicitud Info */}
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">
                            Información de la solicitud
                        </h2>
                        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <InfoField label="N° Solicitud" value={`S-${solicitud.numerosolicitud}`} />
                            <InfoField label="Fecha de solicitud" value={formatDate(solicitud.creada_en)} />
                            <InfoField
                                label="Tipo de solicitud"
                                value={solicitud.tipo_solicitud?.descripcion ?? solicitud.codigotiposolicitud}
                            />
                            <InfoField label="Estado" value={solicitud.estado} />
                            <InfoField label="Solicitante" value={getSolicitanteNombre(solicitud)} />
                            <InfoField label="Centro médico" value={solicitud.centromedico} />
                            <InfoField label="Patología" value={solicitud.patologia} />
                            <InfoField label="Representante" value={solicitud.cedularepresentante} />
                        </div>
                    </CardContent>
                </Card>

                {/* Persona que recibe */}
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">
                            Persona que recibe
                        </h2>
                        <p className="mt-1 text-sm text-[#5B5B5B]/70">
                            Selecciona de la lista o ingresa la cédula manualmente.
                        </p>

                        <div className="mt-4 space-y-4">
                            {/* Dropdown de personas */}
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Buscar persona registrada
                                </label>
                                <div className="relative">
                                    <div className="flex h-10 items-center gap-2 rounded-lg border border-[#E7E7E7] bg-white px-3 focus-within:ring-2 focus-within:ring-donamed-light">
                                        <Search className="h-4 w-4 text-[#8B9096]" />
                                        <input
                                            type="text"
                                            value={personaSearch}
                                            onChange={(e) => setPersonaSearch(e.target.value)}
                                            placeholder="Buscar por cédula, nombre o apellido..."
                                            className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                                        />
                                        {personaSearch && (
                                            <button
                                                type="button"
                                                onClick={() => setPersonaSearch("")}
                                                className="text-[#8B9096] hover:text-[#404040]"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    {personaSearch.trim() && filteredPersonas.length > 0 && (
                                        <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-[#E7E7E7] bg-white shadow-lg">
                                            {filteredPersonas.slice(0, 20).map((p) => (
                                                <button
                                                    key={p.cedula}
                                                    type="button"
                                                    onClick={() => {
                                                        setCedula(p.cedula);
                                                        setSelectedPersona(p);
                                                        setPersonaSearch("");
                                                    }}
                                                    className="flex w-full items-center gap-3 border-b border-[#EEF1F4] px-4 py-3 text-left text-sm transition last:border-0 hover:bg-[#F9FBFC]"
                                                >
                                                    <span className="font-mono text-xs text-[#8B9096]">{p.cedula}</span>
                                                    <span className="font-medium text-[#2D3748]">
                                                        {p.nombre} {p.apellidos}
                                                    </span>
                                                    {p.telefono && (
                                                        <span className="ml-auto text-xs text-[#8B9096]">{p.telefono}</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {personaSearch.trim() && filteredPersonas.length === 0 && (
                                        <div className="absolute z-20 mt-1 w-full rounded-lg border border-[#E7E7E7] bg-white px-4 py-3 text-sm text-[#5B5B5B]/60 shadow-lg">
                                            No se encontraron personas
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cédula manual */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="flex flex-col gap-2 text-sm">
                                    <label
                                        htmlFor="cedula"
                                        className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]"
                                    >
                                        Cédula de quien recibe
                                    </label>
                                    <input
                                        id="cedula"
                                        type="text"
                                        maxLength={11}
                                        value={cedula}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, "");
                                            setCedula(val);
                                            const match = personas.find((p) => p.cedula === val);
                                            setSelectedPersona(match ?? null);
                                        }}
                                        placeholder="Ej: 00112345678"
                                        className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    />
                                </div>
                            </div>

                            {/* Info de persona seleccionada */}
                            {selectedPersona && (
                                <div className="rounded-xl border border-donamed-primary/20 bg-donamed-light/30 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-donamed-dark">
                                        Persona seleccionada
                                    </p>
                                    <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                        <div>
                                            <span className="text-xs text-[#8B9096]">Cédula</span>
                                            <p className="text-sm font-medium text-[#2D3748]">{selectedPersona.cedula}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-[#8B9096]">Nombre</span>
                                            <p className="text-sm font-medium text-[#2D3748]">
                                                {selectedPersona.nombre} {selectedPersona.apellidos}
                                            </p>
                                        </div>
                                        {selectedPersona.telefono && (
                                            <div>
                                                <span className="text-xs text-[#8B9096]">Teléfono</span>
                                                <p className="text-sm font-medium text-[#2D3748]">{selectedPersona.telefono}</p>
                                            </div>
                                        )}
                                        {selectedPersona.sexo && (
                                            <div>
                                                <span className="text-xs text-[#8B9096]">Sexo</span>
                                                <p className="text-sm font-medium text-[#2D3748]">
                                                    {selectedPersona.sexo === "M" ? "Masculino" : "Femenino"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Medicamentos solicitados (read-only) */}
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-0">
                        <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                            <h2 className="text-base font-semibold text-[#1E1E1E]">
                                Medicamentos solicitados
                            </h2>
                            <p className="text-sm text-[#5B5B5B]/70">
                                Lista de medicamentos solicitados por el paciente.
                            </p>
                        </div>

                        <div className="w-full">
                            <div className="grid grid-cols-[0.3fr_1.6fr_1fr_1fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                <span>#</span>
                                <span>Medicamento</span>
                                <span>Dosis</span>
                                <span>Fecha registro</span>
                            </div>

                            {(solicitud.medicamento_solicitado ?? []).length > 0 ? (
                                (solicitud.medicamento_solicitado ?? []).map((med, idx) => (
                                    <div
                                        key={med.id}
                                        className="grid grid-cols-[0.3fr_1.6fr_1fr_1fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                    >
                                        <span className="text-xs text-[#8B9096]">{idx + 1}</span>
                                        <span className="font-medium">{med.nombre}</span>
                                        <span className="text-xs">{med.dosis || "—"}</span>
                                        <span className="text-xs">
                                            {med.creado_en ? formatDate(med.creado_en) : "—"}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="py-6 text-center text-sm text-[#5B5B5B]/60">
                                    No hay medicamentos registrados
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Detalle pre-asignado (si existe) */}
                {tieneDetallesPrevios && (
                    <Card className="overflow-hidden border-[#EEF1F4]">
                        <CardContent className="p-0">
                            <div className="border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                                <h2 className="text-base font-semibold text-[#1E1E1E]">
                                    Medicamentos asignados del inventario
                                </h2>
                                <p className="text-sm text-[#5B5B5B]/70">
                                    Estos medicamentos fueron asignados previamente durante la revisión.
                                </p>
                            </div>
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[750px]">
                                    <div className="grid grid-cols-[1.2fr_0.7fr_0.6fr_1fr_1fr_0.8fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                        <span>Medicamento</span>
                                        <span>Lote</span>
                                        <span>Cantidad</span>
                                        <span>Dosis indicada</span>
                                        <span>Tiempo tratamiento</span>
                                        <span>Almacén</span>
                                    </div>
                                    {(solicitud.detalle_solicitud ?? []).map((det, idx) => (
                                        <div
                                            key={`${det.codigolote}-${det.idalmacen}-${idx}`}
                                            className="grid grid-cols-[1.2fr_0.7fr_0.6fr_1fr_1fr_0.8fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                                        >
                                            <span className="font-medium">
                                                {det.lote?.medicamento?.nombre ?? "—"}
                                            </span>
                                            <span className="text-xs">{det.codigolote}</span>
                                            <span>{det.cantidad}</span>
                                            <span className="text-xs">{det.dosis_indicada || "—"}</span>
                                            <span className="text-xs">{det.tiempo_tratamiento || "—"}</span>
                                            <span className="text-xs">
                                                {det.almacen?.nombre ?? `#${det.idalmacen}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Asignar detalles inline si NO hay pre-asignados */}
                {!tieneDetallesPrevios && (
                    <Card className="overflow-hidden border-[#EEF1F4]">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                                <div>
                                    <h2 className="text-base font-semibold text-[#1E1E1E]">
                                        Asignar medicamentos del inventario
                                    </h2>
                                    <p className="text-sm text-[#5B5B5B]/70">
                                        No hay medicamentos pre-asignados. Selecciona los lotes a despachar.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    className="h-9 gap-1.5 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                                    onClick={addDetalleRow}
                                    disabled={isLoadingInventario}
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar fila
                                </Button>
                            </div>

                            {isLoadingInventario ? (
                                <div className="py-8 text-center text-sm text-[#5B5B5B]/60">
                                    Cargando inventario...
                                </div>
                            ) : inventario.length === 0 ? (
                                <div className="py-8 text-center text-sm text-[#5B5B5B]/60">
                                    No hay items con stock disponible en el inventario.
                                </div>
                            ) : (
                                <div className="p-6 space-y-4">
                                    {detalleRows.length === 0 ? (
                                        <div className="py-6 text-center text-sm text-[#5B5B5B]/60">
                                            Haz clic en "Agregar fila" para asignar medicamentos del inventario.
                                        </div>
                                    ) : (
                                        detalleRows.map((row) => {
                                            const selectedInv = inventario.find(
                                                (i) => `${i.idalmacen}|${i.codigolote}` === row.inventarioKey
                                            );
                                            return (
                                                <div
                                                    key={row.key}
                                                    className="rounded-xl border border-[#E7E7E7] bg-[#FBFBFC] p-4 space-y-3"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1">
                                                            <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                                                Medicamento (Lote / Almacén / Stock)
                                                            </label>
                                                            <select
                                                                value={row.inventarioKey}
                                                                onChange={(e) => updateDetalleRow(row.key, "inventarioKey", e.target.value)}
                                                                className="mt-1 h-10 w-full rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                                            >
                                                                <option value="">Seleccionar del inventario...</option>
                                                                {inventario.map((item) => (
                                                                    <option
                                                                        key={`${item.idalmacen}-${item.codigolote}`}
                                                                        value={`${item.idalmacen}|${item.codigolote}`}
                                                                    >
                                                                        {getInventarioLabel(item)}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeDetalleRow(row.key)}
                                                            className="mt-6 flex h-9 w-9 items-center justify-center rounded-lg border border-danger/30 text-danger hover:bg-danger/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    <div className="grid gap-3 sm:grid-cols-3">
                                                        <div>
                                                            <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                                                Cantidad
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                max={selectedInv?.cantidad ?? 9999}
                                                                value={row.cantidad}
                                                                onChange={(e) => updateDetalleRow(row.key, "cantidad", parseInt(e.target.value, 10) || 0)}
                                                                className="mt-1 h-10 w-full rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                                            />
                                                            {selectedInv && (
                                                                <p className="mt-1 text-xs text-[#8B9096]">
                                                                    Disponible: {selectedInv.cantidad}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                                                Dosis indicada
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={row.dosis_indicada}
                                                                onChange={(e) => updateDetalleRow(row.key, "dosis_indicada", e.target.value)}
                                                                placeholder="Ej: 1 tableta cada 8h"
                                                                className="mt-1 h-10 w-full rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                                                Tiempo tratamiento
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={row.tiempo_tratamiento}
                                                                onChange={(e) => updateDetalleRow(row.key, "tiempo_tratamiento", e.target.value)}
                                                                placeholder="Ej: 30 días"
                                                                className="mt-1 h-10 w-full rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl"
                        onClick={() => navigate("/despachos")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="h-11 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Truck className="mr-2 h-4 w-4" />
                        )}
                        {isSubmitting ? "Procesando..." : "Confirmar despacho"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
