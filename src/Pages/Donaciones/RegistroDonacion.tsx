import { useEffect, useState } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { donacionService } from "@/services/donacionService";
import { proveedorService } from "@/services/proveedorService";
import { almacenService } from "@/services/almacenService";
import { medicamentoService } from "@/services/medicamentoService";
import {
    loteService,
    sugerirCodigoLote,
    isValidLoteCodigo,
} from "@/services/loteService";
import type { Proveedor } from "@/types/proveedor.types";
import type { Almacen } from "@/services/almacenService";
import type { Medicamento } from "@/services/medicamentoService";

interface MedicamentoItem {
    id: string;
    codigomedicamento: string;
    idalmacen: number;
    codigolote: string;
    fechafabricacion: string;
    fechavencimiento: string;
    cantidad: number;
}

export function RegistroDonacion() {
    const navigate = useNavigate();
    const [proveedor, setProveedor] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [items, setItems] = useState<MedicamentoItem[]>([
        {
            id: "1",
            codigomedicamento: "",
            idalmacen: 0,
            codigolote: sugerirCodigoLote(1),
            fechafabricacion: "",
            fechavencimiento: "",
            cantidad: 0,
        },
    ]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        proveedorService.getProveedores({ limit: 500 }).then((r) => setProveedores(r.data));
        almacenService.getAlmacenes().then(setAlmacenes);
        medicamentoService.getMedicamentos({ limit: 500 }).then((r) => setMedicamentos(r.data));
    }, []);

    const handleAddItem = () => {
        const nextIndex = items.length + 1;
        setItems((prev) => [
            ...prev,
            {
                id: `med-${Date.now()}`,
                codigomedicamento: "",
                idalmacen: almacenes[0]?.idalmacen ?? 0,
                codigolote: sugerirCodigoLote(nextIndex),
                fechafabricacion: "",
                fechavencimiento: "",
                cantidad: 0,
            },
        ]);
    };

    const handleItemChange = (
        id: string,
        field: keyof Omit<MedicamentoItem, "id">,
        value: number | string
    ) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const handleGenerarCodigoLote = (id: string) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;
        const idx = items.findIndex((i) => i.id === id) + 1;
        handleItemChange(id, "codigolote", sugerirCodigoLote(idx));
    };

    const handleRemoveItem = (id: string) => {
        setItems((prev) => (prev.length > 1 ? prev.filter((m) => m.id !== id) : prev));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const validItems = items.filter(
                (m) =>
                    m.codigomedicamento &&
                    m.idalmacen &&
                    m.codigolote &&
                    isValidLoteCodigo(m.codigolote) &&
                    m.fechafabricacion &&
                    m.fechavencimiento &&
                    m.cantidad > 0
            );

            if (validItems.length === 0) {
                setError(
                    "Completa al menos un medicamento con: medicamento, almacén, código de lote (formato LOT-YYYYMMDD-NNN), fechas y cantidad."
                );
                setIsLoading(false);
                return;
            }

            for (const item of validItems) {
                await loteService.createLote({
                    codigolote: item.codigolote,
                    codigomedicamento: item.codigomedicamento,
                    fechafabricacion: item.fechafabricacion,
                    fechavencimiento: item.fechavencimiento,
                });
            }

            const medicamentosPayload = validItems.map((m) => ({
                idalmacen: m.idalmacen,
                codigolote: m.codigolote,
                cantidad: m.cantidad,
            }));

            await donacionService.createDonacion({
                proveedor: proveedor.trim() || undefined,
                descripcion: descripcion.trim() || undefined,
                medicamentos: medicamentosPayload,
            });
            navigate("/donaciones");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al registrar donación");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/donaciones")}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a donaciones
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">Registro de Donación</h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Selecciona medicamento, crea un lote con fechas de fabricación y vencimiento, y
                    asígnalo a un almacén. El código de lote debe seguir el formato LOT-YYYYMMDD-NNN
                    (ej: LOT-20250211-001).
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
                        <h2 className="text-base font-semibold text-[#1E1E1E]">
                            Datos generales
                        </h2>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Proveedor / Donante
                                </label>
                                <select
                                    value={proveedor}
                                    onChange={(e) => setProveedor(e.target.value)}
                                    className="h-11 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Seleccionar proveedor (opcional)</option>
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
                                    placeholder="Notas adicionales sobre la donación"
                                    className="min-h-[100px] rounded-lg border border-[#E7E7E7] px-3 py-2 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-[#1E1E1E]">
                                    Medicamentos donados
                                </h2>
                                <p className="text-sm text-[#5B5B5B]/70">
                                    Primero selecciona el medicamento, luego crea el lote con el
                                    código y fechas. Cada ítem suma al inventario del almacén.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                className="h-10 gap-2 rounded-xl"
                                onClick={handleAddItem}
                            >
                                <Plus className="h-4 w-4" />
                                Agregar medicamento
                            </Button>
                        </div>

                        <div className="mt-5 overflow-x-auto">
                            <div className="grid gap-3 text-xs font-semibold uppercase tracking-wide text-[#8B9096] min-w-[800px] grid-cols-[1.2fr_1fr_1.2fr_0.9fr_0.9fr_0.7fr_auto]">
                                <span>Medicamento</span>
                                <span>Almacén</span>
                                <span>Código lote</span>
                                <span>Fab. (YYYY-MM-DD)</span>
                                <span>Venc. (YYYY-MM-DD)</span>
                                <span>Cantidad</span>
                                <span className="hidden sm:block">Acción</span>
                            </div>

                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid gap-2 sm:gap-4 min-w-[800px] grid-cols-[1.2fr_1fr_1.2fr_0.9fr_0.9fr_0.7fr_auto] sm:items-center mt-4"
                                >
                                    <div className="flex flex-col gap-1">
                                        <select
                                            value={item.codigomedicamento}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    item.id,
                                                    "codigomedicamento",
                                                    e.target.value
                                                )
                                            }
                                            className="h-11 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                        >
                                            <option value="">Seleccionar medicamento</option>
                                            {medicamentos.map((m) => (
                                                <option key={m.codigomedicamento} value={m.codigomedicamento}>
                                                    {m.nombre} ({m.codigomedicamento})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <select
                                            value={item.idalmacen || ""}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    item.id,
                                                    "idalmacen",
                                                    Number(e.target.value) || 0
                                                )
                                            }
                                            className="h-11 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                        >
                                            <option value="">Seleccionar almacén</option>
                                            {almacenes.map((a) => (
                                                <option key={a.idalmacen} value={a.idalmacen}>
                                                    {a.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-1">
                                            <input
                                                type="text"
                                                value={item.codigolote}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        item.id,
                                                        "codigolote",
                                                        e.target.value.toUpperCase()
                                                    )
                                                }
                                                placeholder="LOT-20250211-001"
                                                className={`h-11 flex-1 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-donamed-light ${
                                                    item.codigolote && !isValidLoteCodigo(item.codigolote)
                                                        ? "border-danger"
                                                        : "border-[#E7E7E7] text-[#404040]"
                                                }`}
                                                title="Formato: LOT-YYYYMMDD-NNN"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleGenerarCodigoLote(item.id)}
                                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-donamed-primary hover:bg-donamed-light/20 transition"
                                                title="Generar código"
                                            >
                                                <Sparkles className="h-4 w-4" />
                                            </button>
                                        </div>
                                        {item.codigolote && !isValidLoteCodigo(item.codigolote) && (
                                            <span className="text-xs text-danger">
                                                Formato: LOT-YYYYMMDD-NNN
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <input
                                            type="date"
                                            value={item.fechafabricacion}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    item.id,
                                                    "fechafabricacion",
                                                    e.target.value
                                                )
                                            }
                                            className="h-11 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <input
                                            type="date"
                                            value={item.fechavencimiento}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    item.id,
                                                    "fechavencimiento",
                                                    e.target.value
                                                )
                                            }
                                            className="h-11 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <input
                                            type="number"
                                            min={1}
                                            value={item.cantidad || ""}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    item.id,
                                                    "cantidad",
                                                    parseInt(e.target.value, 10) || 0
                                                )
                                            }
                                            placeholder="0"
                                            className="h-11 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={items.length === 1}
                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-danger transition hover:border-danger/40 hover:bg-danger/5 disabled:opacity-40 disabled:cursor-not-allowed"
                                            title="Quitar"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl"
                        onClick={() => navigate("/donaciones")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="h-11 rounded-xl bg-donamed-primary hover:bg-donamed-dark disabled:opacity-70"
                    >
                        {isLoading ? "Guardando..." : "Registrar donación"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
