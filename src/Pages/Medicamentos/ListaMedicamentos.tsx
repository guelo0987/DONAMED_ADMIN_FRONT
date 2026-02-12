import { useMemo, useState } from "react";
import { Search, Eye, ChevronDown, Plus, PencilLine, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Estados según tipo_estado_general de la DB
type EstadoMedicamento = "ACTIVO" | "INACTIVO" | "ELIMINADO";

interface Medicamento {
    codigomedicamento: string;
    nombre: string;
    descripcion: string | null;
    compuesto_principal: string;
    idforma_farmaceutica: number;
    idvia_administracion: number;
    cantidad_disponible_global: number;
    estado: EstadoMedicamento;
    creado_en: string;
    actualizado_en: string;
    formaFarmaceutica?: string;
    viaAdministracion?: string;
}

// Datos de ejemplo alineados con tabla medicamento
const medicamentosData: Medicamento[] = [
    {
        codigomedicamento: "MED-001",
        nombre: "Metformina 500mg",
        descripcion: "Antidiabético oral para diabetes tipo 2",
        compuesto_principal: "Metformina clorhidrato",
        idforma_farmaceutica: 1,
        idvia_administracion: 1,
        cantidad_disponible_global: 450,
        estado: "ACTIVO",
        creado_en: "2024-01-15T10:00:00",
        actualizado_en: "2025-02-10T14:30:00",
        formaFarmaceutica: "Tableta",
        viaAdministracion: "Oral",
    },
    {
        codigomedicamento: "MED-002",
        nombre: "Paracetamol 500mg",
        descripcion: "Analgésico y antipirético",
        compuesto_principal: "Paracetamol",
        idforma_farmaceutica: 1,
        idvia_administracion: 1,
        cantidad_disponible_global: 820,
        estado: "ACTIVO",
        creado_en: "2024-02-20T09:00:00",
        actualizado_en: "2025-02-11T08:00:00",
        formaFarmaceutica: "Tableta",
        viaAdministracion: "Oral",
    },
    {
        codigomedicamento: "MED-003",
        nombre: "Amoxicilina 500mg",
        descripcion: "Antibiótico de amplio espectro",
        compuesto_principal: "Amoxicilina trihidrato",
        idforma_farmaceutica: 2,
        idvia_administracion: 1,
        cantidad_disponible_global: 120,
        estado: "ACTIVO",
        creado_en: "2024-03-10T11:00:00",
        actualizado_en: "2025-02-09T16:00:00",
        formaFarmaceutica: "Cápsula",
        viaAdministracion: "Oral",
    },
    {
        codigomedicamento: "MED-004",
        nombre: "Salbutamol inhalador",
        descripcion: "Broncodilatador para asma",
        compuesto_principal: "Salbutamol sulfato",
        idforma_farmaceutica: 4,
        idvia_administracion: 3,
        cantidad_disponible_global: 35,
        estado: "ACTIVO",
        creado_en: "2024-04-05T08:00:00",
        actualizado_en: "2025-02-08T12:00:00",
        formaFarmaceutica: "Inhalador",
        viaAdministracion: "Inhalatoria",
    },
    {
        codigomedicamento: "MED-005",
        nombre: "Ibuprofeno 400mg",
        descripcion: "Antiinflamatorio no esteroideo",
        compuesto_principal: "Ibuprofeno",
        idforma_farmaceutica: 1,
        idvia_administracion: 1,
        cantidad_disponible_global: 0,
        estado: "INACTIVO",
        creado_en: "2024-05-12T14:00:00",
        actualizado_en: "2025-01-20T10:00:00",
        formaFarmaceutica: "Tableta",
        viaAdministracion: "Oral",
    },
];

const statusStyles: Record<EstadoMedicamento, string> = {
    ACTIVO: "bg-success-light text-success",
    INACTIVO: "bg-warning-light text-warning",
    ELIMINADO: "bg-danger-light text-danger",
};

const estadoLabels: Record<EstadoMedicamento, string> = {
    ACTIVO: "Activo",
    INACTIVO: "Inactivo",
    ELIMINADO: "Eliminado",
};

export function ListaMedicamentos() {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>(() => [...medicamentosData]);
    const [searchTerm, setSearchTerm] = useState("");
    const [estado, setEstado] = useState<EstadoMedicamento | "all">("all");
    const [mostrarSoloBajoStock, setMostrarSoloBajoStock] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [eliminarTarget, setEliminarTarget] = useState<Medicamento | null>(null);

    const handleEliminar = () => {
        if (!eliminarTarget) return;
        setMedicamentos((prev) => prev.filter((m) => m.codigomedicamento !== eliminarTarget.codigomedicamento));
        setEliminarTarget(null);
    };

    const filteredMedicamentos = useMemo(() => {
        return medicamentos.filter((m) => {
            const matchesSearch =
                searchTerm.trim() === "" ||
                m.codigomedicamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.compuesto_principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (m.formaFarmaceutica?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                (m.viaAdministracion?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
            const matchesEstado = estado === "all" || m.estado === estado;
            const matchesBajoStock =
                !mostrarSoloBajoStock || m.cantidad_disponible_global < 100;

            return matchesSearch && matchesEstado && matchesBajoStock;
        });
    }, [medicamentos, searchTerm, estado, mostrarSoloBajoStock]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Medicamentos</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Catálogo de medicamentos según forma farmacéutica y vía de administración.
                    </p>
                </div>
                <Button
                    asChild
                    className="h-10 gap-2 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                >
                    <Link to="/medicamentos/nuevo">
                        <Plus className="h-4 w-4" />
                        Nuevo medicamento
                    </Link>
                </Button>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <div className="flex items-center gap-3 text-sm text-[#5B5B5B]/80">
                            <span className="rounded-full bg-donamed-light px-3 py-1 text-xs font-semibold text-donamed-dark">
                                {filteredMedicamentos.length} resultados
                            </span>
                            <span>Catálogo actualizado</span>
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
                            <div className="group flex h-11 w-[280px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                                    <Search className="h-4 w-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por código, nombre, compuesto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="border-b border-[#EEF1F4] bg-white px-6 py-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="flex flex-col gap-2 text-sm">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                        Estado
                                    </span>
                                    <select
                                        value={estado}
                                        onChange={(e) =>
                                            setEstado(e.target.value as EstadoMedicamento | "all")
                                        }
                                        className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                    >
                                        <option value="all">Todos</option>
                                        {(Object.keys(estadoLabels) as EstadoMedicamento[]).map(
                                            (e) => (
                                                <option key={e} value={e}>
                                                    {estadoLabels[e]}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <input
                                        type="checkbox"
                                        id="bajoStock"
                                        checked={mostrarSoloBajoStock}
                                        onChange={(e) => setMostrarSoloBajoStock(e.target.checked)}
                                        className="h-4 w-4 rounded border-[#E7E7E7]"
                                    />
                                    <label
                                        htmlFor="bajoStock"
                                        className="text-sm text-[#404040]"
                                    >
                                        Solo stock bajo (&lt;100 unidades)
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="w-full">
                        <div className="grid grid-cols-[0.9fr_1.5fr_1.2fr_0.9fr_0.9fr_0.8fr_0.9fr_0.9fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Código</span>
                            <span>Nombre</span>
                            <span>Compuesto principal</span>
                            <span>Forma</span>
                            <span>Vía</span>
                            <span>Stock</span>
                            <span>Estado</span>
                            <span>Acciones</span>
                        </div>

                        {filteredMedicamentos.map((med) => (
                            <div
                                key={med.codigomedicamento}
                                className="grid grid-cols-[0.9fr_1.5fr_1.2fr_0.9fr_0.9fr_0.8fr_0.9fr_0.9fr] gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <span className="font-medium">{med.codigomedicamento}</span>
                                <span className="font-medium">{med.nombre}</span>
                                <span className="truncate" title={med.compuesto_principal}>
                                    {med.compuesto_principal}
                                </span>
                                <span>{med.formaFarmaceutica}</span>
                                <span>{med.viaAdministracion}</span>
                                <span
                                    className={
                                        med.cantidad_disponible_global < 100
                                            ? "font-semibold text-warning"
                                            : ""
                                    }
                                >
                                    {med.cantidad_disponible_global}
                                </span>
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[med.estado]}`}
                                >
                                    {estadoLabels[med.estado]}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/medicamentos/${med.codigomedicamento}`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                        title="Ver detalle"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        to={`/medicamentos/${med.codigomedicamento}/editar`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#5B5B5B] transition hover:border-donamed-primary/40 hover:text-donamed-dark"
                                        title="Editar"
                                    >
                                        <PencilLine className="h-4 w-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setEliminarTarget(med)}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-danger transition hover:border-danger/40 hover:bg-danger/5"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <Link
                                        to={`/inventario/medicamento/${med.codigomedicamento}`}
                                        className="inline-flex h-9 items-center justify-center rounded-xl border-2 border-donamed-primary bg-white px-3 text-xs font-semibold text-donamed-primary transition hover:bg-[#F7F7F7]"
                                    >
                                        Inventario
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {filteredMedicamentos.length === 0 && (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No se encontraron medicamentos
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {eliminarTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-[0px_30px_80px_-40px_rgba(0,0,0,0.6)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Eliminar medicamento
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-[#1E1E1E]">
                                    {eliminarTarget.codigomedicamento} · {eliminarTarget.nombre}
                                </h3>
                                <p className="mt-2 text-sm text-[#5B5B5B]/80">
                                    ¿Estás seguro? Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEliminarTarget(null)}
                                className="rounded-lg border border-[#E7E7E7] px-3 py-1 text-sm text-[#5B5B5B] hover:bg-[#F7F7F7]"
                            >
                                Cerrar
                            </button>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 rounded-xl"
                                onClick={() => setEliminarTarget(null)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                className="h-11 rounded-xl bg-danger text-white hover:bg-danger/90"
                                onClick={handleEliminar}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
