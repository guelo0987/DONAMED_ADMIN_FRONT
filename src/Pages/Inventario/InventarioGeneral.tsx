import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Warehouse, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type StockEstado = "Normal" | "Bajo";

interface InventarioItem {
    id: string;
    medicamento: string;
    categoria: string;
    total: number;
    estado: StockEstado;
    almacen: string;
    estadoLote: "Vigente" | "Proximo" | "Vencido";
}

const inventarioData: InventarioItem[] = [
    {
        id: "med-1",
        medicamento: "Paracetamol 500mg",
        categoria: "Analgesico",
        total: 820,
        estado: "Normal",
        almacen: "Central",
        estadoLote: "Vigente",
    },
    {
        id: "med-2",
        medicamento: "Amoxicilina 500mg",
        categoria: "Antibiotico",
        total: 120,
        estado: "Bajo",
        almacen: "Norte",
        estadoLote: "Proximo",
    },
    {
        id: "med-3",
        medicamento: "Ibuprofeno 400mg",
        categoria: "Antiinflamatorio",
        total: 480,
        estado: "Normal",
        almacen: "Central",
        estadoLote: "Vigente",
    },
    {
        id: "med-4",
        medicamento: "Salbutamol",
        categoria: "Respiratorio",
        total: 60,
        estado: "Bajo",
        almacen: "Sur",
        estadoLote: "Vencido",
    },
];

const stockStyles: Record<StockEstado, string> = {
    Normal: "bg-success-light text-success",
    Bajo: "bg-warning-light text-warning",
};

const loteStyles: Record<InventarioItem["estadoLote"], string> = {
    Vigente: "bg-success-light text-success",
    Proximo: "bg-warning-light text-warning",
    Vencido: "bg-danger-light text-danger",
};

export function InventarioGeneral() {
    const [search, setSearch] = useState("");
    const [categoria, setCategoria] = useState("");
    const [almacen, setAlmacen] = useState("");
    const [estadoLote, setEstadoLote] = useState("");

    const filtered = useMemo(() => {
        return inventarioData.filter((item) => {
            const matchesSearch =
                search.trim() === "" ||
                item.medicamento.toLowerCase().includes(search.toLowerCase());
            const matchesCategoria =
                categoria === "" || item.categoria.toLowerCase() === categoria.toLowerCase();
            const matchesAlmacen = almacen === "" || item.almacen === almacen;
            const matchesLote = estadoLote === "" || item.estadoLote === estadoLote;

            return matchesSearch && matchesCategoria && matchesAlmacen && matchesLote;
        });
    }, [search, categoria, almacen, estadoLote]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-[#1E1E1E]">Inventario</h1>
                    <p className="mt-1 text-sm text-[#5B5B5B]/80">
                        Visualiza stock consolidado y alertas de vencimiento.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button
                        asChild
                        variant="outline"
                        className="h-10 rounded-xl border-[#E7E7E7]"
                    >
                        <Link to="/inventario/almacen">
                            <Warehouse className="h-4 w-4" />
                            Ver por almacen
                        </Link>
                    </Button>
                    <Button
                        asChild
                        className="h-10 rounded-xl bg-donamed-primary text-white hover:bg-donamed-dark"
                    >
                        <Link to="/inventario/movimientos">
                            Movimientos
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden border-[#EEF1F4]">
                <CardContent className="p-0">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1F4] bg-[#FBFBFC] px-6 py-5">
                        <div className="flex items-center gap-3 text-sm text-[#5B5B5B]/80">
                            <span className="rounded-full bg-donamed-light px-3 py-1 text-xs font-semibold text-donamed-dark">
                                {filtered.length} medicamentos
                            </span>
                            <span>Inventario general</span>
                        </div>
                        <div className="group flex h-11 w-[260px] items-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar medicamento"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="border-b border-[#EEF1F4] bg-white px-6 py-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Medicamento
                                </span>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Nombre del medicamento"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Categoria
                                </span>
                                <input
                                    type="text"
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                    placeholder="Categoria"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Almacen
                                </span>
                                <input
                                    type="text"
                                    value={almacen}
                                    onChange={(e) => setAlmacen(e.target.value)}
                                    placeholder="Almacen"
                                    className="h-10 rounded-lg border border-[#E7E7E7] px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                                    Estado del lote
                                </span>
                                <select
                                    value={estadoLote}
                                    onChange={(e) => setEstadoLote(e.target.value)}
                                    className="h-10 rounded-lg border border-[#E7E7E7] bg-white px-3 text-sm text-[#404040] focus:outline-none focus:ring-2 focus:ring-donamed-light"
                                >
                                    <option value="">Todos</option>
                                    <option value="Vigente">Vigente</option>
                                    <option value="Proximo">Proximo a vencer</option>
                                    <option value="Vencido">Vencido</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[1.6fr_1.1fr_1fr_1fr_1fr_0.7fr] gap-4 border-b border-[#EEF1F4] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B9096]">
                            <span>Medicamento</span>
                            <span>Categoria</span>
                            <span>Total disponible</span>
                            <span>Almacen</span>
                            <span>Estado del lote</span>
                            <span>Acciones</span>
                        </div>

                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-[1.6fr_1.1fr_1fr_1fr_1fr_0.7fr] items-center gap-4 border-b border-[#EEF1F4] px-6 py-4 text-sm text-[#2D3748] transition hover:bg-[#F9FBFC]"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{item.medicamento}</span>
                                    <span className="text-xs text-[#5B5B5B]/70">
                                        Stock {item.total} unidades
                                    </span>
                                </div>
                                <span>{item.categoria}</span>
                                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${stockStyles[item.estado]}`}>
                                    {item.estado}
                                </span>
                                <span>{item.almacen}</span>
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${loteStyles[item.estadoLote]}`}
                                >
                                    {item.estadoLote}
                                </span>
                                <Link
                                    to={`/inventario/medicamento/${item.id}`}
                                    className="inline-flex h-9 items-center justify-center rounded-xl bg-donamed-primary px-3 text-xs font-semibold text-white transition hover:bg-donamed-dark"
                                >
                                    Ver detalle
                                </Link>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="py-10 text-center text-sm text-[#5B5B5B]/60">
                                No se encontraron medicamentos
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
