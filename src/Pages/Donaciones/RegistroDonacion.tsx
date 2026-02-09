import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MedicamentoItem {
    id: string;
    medicamento: string;
    forma: string;
    via: string;
    cantidad: string;
    lote: string;
    vencimiento: string;
}

const proveedores = [
    "Laboratorios Sanar",
    "FarmaPlus",
    "Clínica Horizonte",
    "BioHealth",
];

export function RegistroDonacion() {
    const navigate = useNavigate();
    const [donante, setDonante] = useState("");
    const [fecha, setFecha] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [medicamentos, setMedicamentos] = useState<MedicamentoItem[]>([
        {
            id: "med-1",
            medicamento: "",
            forma: "",
            via: "",
            cantidad: "",
            lote: "",
            vencimiento: "",
        },
    ]);

    const handleAddMedicamento = () => {
        setMedicamentos((prev) => [
            ...prev,
            {
                id: `med-${prev.length + 1}`,
                medicamento: "",
                forma: "",
                via: "",
                cantidad: "",
                lote: "",
                vencimiento: "",
            },
        ]);
    };

    const handleMedicamentoChange = (
        id: string,
        field: keyof Omit<MedicamentoItem, "id">,
        value: string
    ) => {
        setMedicamentos((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // TODO: Implement save logic
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">Registro de Donación</h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Completa los datos generales y registra los medicamentos donados.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <h2 className="text-base font-semibold text-[#1E1E1E]">
                            Datos generales
                        </h2>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Donante / Proveedor
                                </label>
                                <select
                                    value={donante}
                                    onChange={(e) => setDonante(e.target.value)}
                                    className="h-11 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Selecciona un donante</option>
                                    {proveedores.map((proveedor) => (
                                        <option key={proveedor} value={proveedor}>
                                            {proveedor}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Fecha de donación
                                </label>
                                <input
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    className="h-11 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm md:col-span-2">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Observaciones
                                </label>
                                <textarea
                                    value={observaciones}
                                    onChange={(e) => setObservaciones(e.target.value)}
                                    placeholder="Notas adicionales sobre la donación"
                                    className="min-h-[120px] rounded-lg border border-[#E7E7E7] px-3 py-2 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
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
                                    Añade cada medicamento y su información clave.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                className="h-10 gap-2 rounded-xl"
                                onClick={handleAddMedicamento}
                            >
                                <Plus className="h-4 w-4" />
                                Agregar medicamento
                            </Button>
                        </div>

                        <div className="mt-5 w-full">
                            <div className="grid gap-3 text-xs font-semibold uppercase tracking-wide text-[#8B9096] sm:grid-cols-2 lg:grid-cols-6">
                                <span className="hidden lg:block">Medicamento</span>
                                <span className="hidden lg:block">Forma</span>
                                <span className="hidden lg:block">Vía</span>
                                <span className="hidden lg:block">Cantidad</span>
                                <span className="hidden lg:block">Lote</span>
                                <span className="hidden lg:block">Fecha de vencimiento</span>
                            </div>

                            <div className="mt-4 space-y-4">
                                {medicamentos.map((item) => (
                                    <div
                                        key={item.id}
                                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6"
                                    >
                                            <input
                                                type="text"
                                                placeholder="Paracetamol 500mg"
                                                value={item.medicamento}
                                                onChange={(e) =>
                                                    handleMedicamentoChange(
                                                        item.id,
                                                        "medicamento",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Tableta"
                                                value={item.forma}
                                                onChange={(e) =>
                                                    handleMedicamentoChange(
                                                        item.id,
                                                        "forma",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Oral"
                                                value={item.via}
                                                onChange={(e) =>
                                                    handleMedicamentoChange(
                                                        item.id,
                                                        "via",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                            />
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={item.cantidad}
                                                onChange={(e) =>
                                                    handleMedicamentoChange(
                                                        item.id,
                                                        "cantidad",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Lote"
                                                value={item.lote}
                                                onChange={(e) =>
                                                    handleMedicamentoChange(
                                                        item.id,
                                                        "lote",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                            />
                                            <input
                                                type="date"
                                                value={item.vencimiento}
                                                onChange={(e) =>
                                                    handleMedicamentoChange(
                                                        item.id,
                                                        "vencimiento",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                            />
                                    </div>
                                ))}
                            </div>
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
                    <Button type="submit" variant="secondary" className="h-11 rounded-xl">
                        Guardar
                    </Button>
                </div>
            </form>
        </div>
    );
}
