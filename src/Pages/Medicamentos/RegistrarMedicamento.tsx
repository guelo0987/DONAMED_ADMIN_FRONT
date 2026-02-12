import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { medicamentoService } from "@/services/medicamentoService";
import { catalogoService } from "@/services/catalogoService";
import { useToast } from "@/contexts/ToastContext";
import type { FormaFarmaceutica, ViaAdministracion, Categoria, Enfermedad } from "@/types/catalogo.types";

export function RegistrarMedicamento() {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [codigomedicamento, setCodigomedicamento] = useState("");
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [compuesto_principal, setCompuesto_principal] = useState("");
    const [idforma_farmaceutica, setIdforma_farmaceutica] = useState<number>(0);
    const [idvia_administracion, setIdvia_administracion] = useState<number>(0);
    const [categorias, setCategorias] = useState<number[]>([]);
    const [enfermedades, setEnfermedades] = useState<number[]>([]);
    const [formasFarmaceuticas, setFormasFarmaceuticas] = useState<FormaFarmaceutica[]>([]);
    const [viasAdministracion, setViasAdministracion] = useState<ViaAdministracion[]>([]);
    const [categoriasList, setCategoriasList] = useState<Categoria[]>([]);
    const [enfermedadesList, setEnfermedadesList] = useState<Enfermedad[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        Promise.all([
            catalogoService.getFormasFarmaceuticas(),
            catalogoService.getViasAdministracion(),
            catalogoService.getCategorias(),
            catalogoService.getEnfermedades(),
        ]).then(([formas, vias, cat, enf]) => {
            setFormasFarmaceuticas(formas);
            setViasAdministracion(vias);
            setCategoriasList(cat);
            setEnfermedadesList(enf);
            if (formas.length) setIdforma_farmaceutica(formas[0].idformafarmaceutica);
            if (vias.length) setIdvia_administracion(vias[0].idvia);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await medicamentoService.createMedicamento({
                codigomedicamento: codigomedicamento.trim(),
                nombre: nombre.trim(),
                descripcion: descripcion.trim() || undefined,
                compuesto_principal: compuesto_principal.trim() || undefined,
                idforma_farmaceutica: formasFarmaceuticas.length ? idforma_farmaceutica : undefined,
                idvia_administracion: viasAdministracion.length ? idvia_administracion : undefined,
                categorias: categorias.length ? categorias : undefined,
                enfermedades: enfermedades.length ? enfermedades : undefined,
            });
            addToast({ variant: "success", title: "Medicamento registrado", message: `${nombre.trim()} fue creado correctamente.` });
            navigate("/medicamentos");
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error al crear medicamento";
            setError(msg);
            addToast({ variant: "error", title: "Error", message: msg });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCategoria = (id: number) => {
        setCategorias((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const toggleEnfermedad = (id: number) => {
        setEnfermedades((prev) =>
            prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
        );
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
                    Completa los datos según tabla medicamento (forma farmacéutica, vía de administración, categorías, enfermedades).
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
                                    Compuesto principal
                                </label>
                                <input
                                    type="text"
                                    value={compuesto_principal}
                                    onChange={(e) => setCompuesto_principal(e.target.value)}
                                    placeholder="Metformina clorhidrato"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Forma farmacéutica
                                </label>
                                <select
                                    value={idforma_farmaceutica}
                                    onChange={(e) => setIdforma_farmaceutica(Number(e.target.value))}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    {formasFarmaceuticas.length === 0 ? (
                                        <option value="">Cargando...</option>
                                    ) : (
                                        formasFarmaceuticas.map((f) => (
                                            <option key={f.idformafarmaceutica} value={f.idformafarmaceutica}>
                                                {f.nombre}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Vía de administración
                                </label>
                                <select
                                    value={idvia_administracion}
                                    onChange={(e) => setIdvia_administracion(Number(e.target.value))}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    {viasAdministracion.length === 0 ? (
                                        <option value="">Cargando...</option>
                                    ) : (
                                        viasAdministracion.map((v) => (
                                            <option key={v.idvia} value={v.idvia}>
                                                {v.nombre}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-sm md:col-span-2">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Categorías
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {categoriasList.map((c) => (
                                        <label
                                            key={c.idcategoria}
                                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#E7E7E7] bg-white px-3 py-2 text-sm transition hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={categorias.includes(c.idcategoria)}
                                                onChange={() => toggleCategoria(c.idcategoria)}
                                                className="h-4 w-4 rounded"
                                            />
                                            {c.nombre}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 text-sm md:col-span-2">
                                <label className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Enfermedades
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {enfermedadesList.map((e) => (
                                        <label
                                            key={e.idenfermedad}
                                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#E7E7E7] bg-white px-3 py-2 text-sm transition hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={enfermedades.includes(e.idenfermedad)}
                                                onChange={() => toggleEnfermedad(e.idenfermedad)}
                                                className="h-4 w-4 rounded"
                                            />
                                            {e.nombre}
                                        </label>
                                    ))}
                                </div>
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
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="h-11 rounded-xl bg-donamed-primary hover:bg-donamed-dark disabled:opacity-70"
                    >
                        {isLoading ? "Guardando..." : "Guardar medicamento"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
