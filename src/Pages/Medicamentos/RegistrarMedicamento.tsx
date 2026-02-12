import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formasFarmaceuticas = [
    { id: 1, nombre: "Tableta" },
    { id: 2, nombre: "Cápsula" },
    { id: 3, nombre: "Jarabe" },
    { id: 4, nombre: "Inhalador" },
    { id: 5, nombre: "Inyección" },
];

const viasAdministracion = [
    { id: 1, nombre: "Oral" },
    { id: 2, nombre: "Sublingual" },
    { id: 3, nombre: "Inhalatoria" },
    { id: 4, nombre: "Tópica" },
    { id: 5, nombre: "Intramuscular" },
];

export function RegistrarMedicamento() {
    const navigate = useNavigate();
    const [codigomedicamento, setCodigomedicamento] = useState("");
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [compuesto_principal, setCompuesto_principal] = useState("");
    const [idforma_farmaceutica, setIdforma_farmaceutica] = useState<number>(1);
    const [idvia_administracion, setIdvia_administracion] = useState<number>(1);
    const [estado, setEstado] = useState<"ACTIVO" | "INACTIVO">("ACTIVO");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Llamar API para crear medicamento
        navigate("/medicamentos");
    };

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/medicamentos")}
                    className="mb-2 inline-flex items-center text-sm font-medium text-[#5B5B5B] hover:text-[#1E1E1E]"
                >
                    ← Volver a medicamentos
                </button>
                <h1 className="text-3xl font-semibold text-[#1E1E1E]">
                    Registrar medicamento
                </h1>
                <p className="mt-1 text-sm text-[#5B5B5B]/80">
                    Completa los datos según tabla medicamento (forma_farmaceutica, via_administracion).
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="overflow-hidden border-[#EEF1F4]">
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Código medicamento *
                                </label>
                                <input
                                    type="text"
                                    value={codigomedicamento}
                                    onChange={(e) => setCodigomedicamento(e.target.value)}
                                    required
                                    placeholder="MED-001"
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
                                    placeholder="Metformina 500mg"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm md:col-span-2">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Compuesto principal *
                                </label>
                                <input
                                    type="text"
                                    value={compuesto_principal}
                                    onChange={(e) => setCompuesto_principal(e.target.value)}
                                    required
                                    placeholder="Metformina clorhidrato"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Forma farmacéutica *
                                </label>
                                <select
                                    value={idforma_farmaceutica}
                                    onChange={(e) => setIdforma_farmaceutica(Number(e.target.value))}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    {formasFarmaceuticas.map((f) => (
                                        <option key={f.id} value={f.id}>
                                            {f.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Vía de administración *
                                </label>
                                <select
                                    value={idvia_administracion}
                                    onChange={(e) => setIdvia_administracion(Number(e.target.value))}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    {viasAdministracion.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Estado
                                </label>
                                <select
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value as "ACTIVO" | "INACTIVO")}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="ACTIVO">Activo</option>
                                    <option value="INACTIVO">Inactivo</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm md:col-span-2">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Descripción
                                </label>
                                <textarea
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    placeholder="Descripción del medicamento"
                                    rows={3}
                                    className="rounded-lg border border-[#E7E7E7] px-3 py-2 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
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
                        onClick={() => navigate("/medicamentos")}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" className="h-11 rounded-xl bg-donamed-primary hover:bg-donamed-dark">
                        Guardar medicamento
                    </Button>
                </div>
            </form>
        </div>
    );
}
