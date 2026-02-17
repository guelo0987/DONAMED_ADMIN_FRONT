import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Search, X } from "lucide-react";
import { inventarioService } from "@/services/inventarioService";
import { almacenService, type Almacen } from "@/services/almacenService";
import { loteService, type Lote } from "@/services/loteService";
import { useToast } from "@/contexts/ToastContext";

export function MovimientosInventario() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form fields
    const [selectedAlmacen, setSelectedAlmacen] = useState("");
    const [selectedLote, setSelectedLote] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [loteSearch, setLoteSearch] = useState("");
    const [showLoteDropdown, setShowLoteDropdown] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const [alms, lotesResult] = await Promise.all([
                almacenService.getAlmacenes(),
                loteService.getLotes({ limit: 500 }),
            ]);
            setAlmacenes(alms);
            setLotes(lotesResult.data);
        } catch {
            addToast({
                variant: "error",
                title: "Error",
                message: "No se pudieron cargar los datos necesarios.",
            });
        } finally {
            setIsLoadingData(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredLotes = lotes.filter((l) => {
        if (!loteSearch.trim()) return true;
        const q = loteSearch.toLowerCase();
        return (
            l.codigolote.toLowerCase().includes(q) ||
            (l.medicamento?.nombre ?? "").toLowerCase().includes(q) ||
            l.codigomedicamento.toLowerCase().includes(q)
        );
    });

    const selectedLoteData = lotes.find((l) => l.codigolote === selectedLote);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAlmacen || !selectedLote || !cantidad) {
            addToast({
                variant: "error",
                title: "Campos requeridos",
                message: "Selecciona almacén, lote y cantidad.",
            });
            return;
        }

        const loteData = lotes.find((l) => l.codigolote === selectedLote);
        if (!loteData) return;

        setIsSaving(true);
        try {
            await inventarioService.ajustarInventario({
                idalmacen: parseInt(selectedAlmacen, 10),
                codigolote: selectedLote,
                codigomedicamento: loteData.codigomedicamento,
                cantidad: parseInt(cantidad, 10),
            });
            addToast({
                variant: "success",
                title: "Inventario ajustado",
                message: `Stock actualizado: ${loteData.medicamento?.nombre ?? loteData.codigomedicamento} → ${cantidad} unidades.`,
            });
            setCantidad("");
            setSelectedLote("");
            setSelectedAlmacen("");
            setLoteSearch("");
        } catch (err) {
            addToast({
                variant: "error",
                title: "Error",
                message: err instanceof Error ? err.message : "No se pudo ajustar el inventario.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-donamed-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/inventario")}
                    className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver a inventario
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Ajustar Inventario
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Establece o actualiza la cantidad de un lote en un almacén específico.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seleccionar almacén */}
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">1. Selecciona el almacén</h2>
                        <div className="mt-4">
                            <select
                                value={selectedAlmacen}
                                onChange={(e) => setSelectedAlmacen(e.target.value)}
                                className="h-10 w-full max-w-sm rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                            >
                                <option value="">Selecciona un almacén</option>
                                {almacenes.map((a) => (
                                    <option key={a.idalmacen} value={a.idalmacen}>
                                        {a.nombre}
                                        {a.ciudad ? ` — ${a.ciudad.nombre}` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Seleccionar lote */}
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">2. Selecciona el lote</h2>
                        <p className="mt-1 text-sm text-[#5B5B5B]/70">
                            Busca por código de lote, nombre de medicamento o código.
                        </p>
                        <div className="mt-4 max-w-lg">
                            <div className="relative">
                                <div className="flex h-10 items-center gap-2 rounded-lg border border-[#E7E7E7] bg-white px-3 focus-within:ring-2 focus-within:ring-donamed-light">
                                    <Search className="h-4 w-4 text-[#8B9096]" />
                                    <input
                                        type="text"
                                        value={loteSearch}
                                        onChange={(e) => {
                                            setLoteSearch(e.target.value);
                                            setShowLoteDropdown(true);
                                        }}
                                        onFocus={() => setShowLoteDropdown(true)}
                                        placeholder="Buscar lote por código, medicamento..."
                                        className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                                    />
                                    {loteSearch && (
                                        <button type="button" onClick={() => { setLoteSearch(""); setShowLoteDropdown(false); }} className="text-[#8B9096] hover:text-[#404040]">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                                {showLoteDropdown && filteredLotes.length > 0 && (
                                    <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-[#E7E7E7] bg-white shadow-lg">
                                        {filteredLotes.slice(0, 30).map((l) => (
                                            <button
                                                key={l.codigolote}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedLote(l.codigolote);
                                                    setLoteSearch(
                                                        `${l.codigolote} — ${l.medicamento?.nombre ?? l.codigomedicamento}`
                                                    );
                                                    setShowLoteDropdown(false);
                                                }}
                                                className={`flex w-full items-center justify-between border-b border-[#EEF1F4] px-4 py-3 text-left text-sm transition last:border-0 hover:bg-[#F9FBFC] ${selectedLote === l.codigolote ? "bg-donamed-light/40" : ""}`}
                                            >
                                                <div className="flex flex-col min-w-0">
                                                    <span className="truncate font-medium text-[#2D3748]">
                                                        {l.medicamento?.nombre ?? l.codigomedicamento}
                                                    </span>
                                                    <span className="text-xs text-[#8B9096]">
                                                        Lote: {l.codigolote} · Med: {l.codigomedicamento}
                                                    </span>
                                                </div>
                                                <span className="ml-2 text-xs text-[#8B9096]">
                                                    Vence: {l.fechavencimiento ? new Date(l.fechavencimiento).toLocaleDateString("es-DO") : "—"}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {showLoteDropdown && loteSearch.trim() && filteredLotes.length === 0 && (
                                    <div className="absolute z-20 mt-1 w-full rounded-lg border border-[#E7E7E7] bg-white px-4 py-3 text-sm text-[#5B5B5B]/60 shadow-lg">
                                        No se encontraron lotes
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedLoteData && (
                            <div className="mt-4 rounded-xl border border-donamed-primary/20 bg-donamed-light/30 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-donamed-dark">Lote seleccionado</p>
                                <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <div>
                                        <span className="text-xs text-[#8B9096]">Código lote</span>
                                        <p className="font-mono text-sm font-medium text-[#2D3748]">{selectedLoteData.codigolote}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-[#8B9096]">Medicamento</span>
                                        <p className="text-sm font-medium text-[#2D3748]">
                                            {selectedLoteData.medicamento?.nombre ?? selectedLoteData.codigomedicamento}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-[#8B9096]">Vencimiento</span>
                                        <p className="text-sm font-medium text-[#2D3748]">
                                            {selectedLoteData.fechavencimiento ? new Date(selectedLoteData.fechavencimiento).toLocaleDateString("es-DO") : "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-[#8B9096]">Fabricación</span>
                                        <p className="text-sm font-medium text-[#2D3748]">
                                            {selectedLoteData.fechafabricacion ? new Date(selectedLoteData.fechafabricacion).toLocaleDateString("es-DO") : "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Cantidad */}
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">3. Cantidad</h2>
                        <p className="mt-1 text-sm text-[#5B5B5B]/70">
                            Establece la cantidad total que tendrá este lote en el almacén seleccionado.
                        </p>
                        <div className="mt-4">
                            <input
                                type="number"
                                min="0"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                placeholder="Ej: 100"
                                className="h-10 w-full max-w-xs rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-xl border-[#E7E7E7]"
                        onClick={() => navigate("/inventario")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={!selectedAlmacen || !selectedLote || !cantidad || isSaving}
                        className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark disabled:opacity-50"
                    >
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Ajustar inventario
                    </Button>
                </div>
            </form>
        </div>
    );
}
