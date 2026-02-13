import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    HandHeart,
    Boxes,
    Truck,
    Pill,
    Briefcase,
    FolderTree,
    ChevronDown,
    MapPin,
    Users,
    Settings,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categoriasSubItems = [
    { label: "Medicamentos", path: "/categorias" },
    { label: "Enfermedades", path: "/categorias-enfermedades" },
];

const ubicacionSubItems = [
    { label: "Ciudades", path: "/ciudades" },
    { label: "Provincias", path: "/provincias" },
];

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: FileText, label: "Solicitudes", path: "/solicitudes" },
    { icon: HandHeart, label: "Donaciones", path: "/donaciones" },
    { icon: Boxes, label: "Inventario", path: "/inventario" },
    { icon: Truck, label: "Despachos", path: "/despachos" },
    { icon: Briefcase, label: "Proveedores", path: "/proveedores" },
    { icon: Pill, label: "Medicamentos", path: "/medicamentos" },
    { icon: Users, label: "Usuarios", path: "/usuarios" },
    { icon: Settings, label: "Configuración", path: "/configuracion" },
];

export function Sidebar() {
    const location = useLocation();
    const isCategoriasActive = location.pathname.startsWith("/categorias");
    const isUbicacionActive =
        location.pathname.startsWith("/ciudades") || location.pathname.startsWith("/provincias");
    const [categoriasOpen, setCategoriasOpen] = useState(isCategoriasActive);
    const [ubicacionOpen, setUbicacionOpen] = useState(isUbicacionActive);

    useEffect(() => {
        if (isCategoriasActive) setCategoriasOpen(true);
    }, [isCategoriasActive]);
    useEffect(() => {
        if (isUbicacionActive) setUbicacionOpen(true);
    }, [isUbicacionActive]);

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-[345px] bg-white transition-colors dark:bg-slate-900 dark:border-r dark:border-slate-700">
            {/* Logo */}
            <div className="flex h-[80px] items-center justify-center px-6">
                <img
                    src="/logos/donamed_logo_header.png"
                    alt="DONAMED"
                    className="h-14 object-contain dark:hidden"
                />
                <img
                    src="/logos/donamed-negativo.svg"
                    alt="DONAMED"
                    className="hidden h-14 object-contain dark:block"
                />
            </div>

            {/* Navigation */}
            <nav className="mt-5 flex flex-col gap-0.5 px-[46px]">
                {menuItems.slice(0, 6).map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-4 rounded-2xl px-6 py-2.5 text-lg font-medium transition-all",
                                isActive
                                    ? "bg-donamed-secondary/20 text-[#2D3748] shadow-[0px_20px_50px_rgba(55,69,87,0.1)] dark:bg-donamed-primary/20 dark:text-slate-100"
                                    : "text-[#404040] hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    className={cn(
                                        "h-8 w-8",
                                        isActive ? "text-[#2D3748]" : "text-[#404040]"
                                    )}
                                />
                                <span className={isActive ? "font-semibold" : "font-medium"}>
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Categorías con dropdown */}
                <div className="flex flex-col gap-0.5">
                    <button
                        type="button"
                        onClick={() => setCategoriasOpen(!categoriasOpen)}
                        className={cn(
                            "flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-2.5 text-left text-lg font-medium transition-all",
                            isCategoriasActive
                                ? "bg-donamed-secondary/20 text-[#2D3748] shadow-[0px_20px_50px_rgba(55,69,87,0.1)] dark:bg-donamed-primary/20 dark:text-slate-100"
                                : "text-[#404040] hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <FolderTree
                                className={cn(
                                    "h-8 w-8",
                                    isCategoriasActive ? "text-[#2D3748]" : "text-[#404040]"
                                )}
                            />
                            <span
                                className={isCategoriasActive ? "font-semibold" : "font-medium"}
                            >
                                Categorías
                            </span>
                        </div>
                        <ChevronDown
                            className={cn(
                                "h-5 w-5 shrink-0 text-[#5B5B5B] transition-transform",
                                categoriasOpen && "rotate-180"
                            )}
                        />
                    </button>
                    {categoriasOpen && (
                        <div className="ml-6 flex flex-col gap-0.5 border-l-2 border-[#E7E7E7] pl-4 dark:border-slate-600">
                            {categoriasSubItems.map((sub) => (
                                <NavLink
                                    key={sub.path}
                                    to={sub.path}
                                    className={({ isActive }) =>
                                        cn(
                                            "rounded-xl px-4 py-2 text-base font-medium transition-all",
                                            isActive
                                                ? "bg-donamed-secondary/20 text-donamed-dark font-semibold dark:bg-donamed-primary/20 dark:text-donamed-secondary"
                                                : "text-[#5B5B5B] hover:bg-gray-100 hover:text-[#2D3748] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                        )
                                    }
                                >
                                    {sub.label}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>

                {/* Ubicación con dropdown */}
                <div className="flex flex-col gap-0.5">
                    <button
                        type="button"
                        onClick={() => setUbicacionOpen(!ubicacionOpen)}
                        className={cn(
                            "flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-2.5 text-left text-lg font-medium transition-all",
                            isUbicacionActive
                                ? "bg-donamed-secondary/20 text-[#2D3748] shadow-[0px_20px_50px_rgba(55,69,87,0.1)] dark:bg-donamed-primary/20 dark:text-slate-100"
                                : "text-[#404040] hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <MapPin
                                className={cn(
                                    "h-8 w-8",
                                    isUbicacionActive ? "text-[#2D3748]" : "text-[#404040]"
                                )}
                            />
                            <span className={isUbicacionActive ? "font-semibold" : "font-medium"}>
                                Ubicación
                            </span>
                        </div>
                        <ChevronDown
                            className={cn(
                                "h-5 w-5 shrink-0 text-[#5B5B5B] transition-transform",
                                ubicacionOpen && "rotate-180"
                            )}
                        />
                    </button>
                    {ubicacionOpen && (
                        <div className="ml-6 flex flex-col gap-0.5 border-l-2 border-[#E7E7E7] pl-4 dark:border-slate-600">
                            {ubicacionSubItems.map((sub) => (
                                <NavLink
                                    key={sub.path}
                                    to={sub.path}
                                    className={({ isActive }) =>
                                        cn(
                                            "rounded-xl px-4 py-2 text-base font-medium transition-all",
                                            isActive
                                                ? "bg-donamed-secondary/20 text-donamed-dark font-semibold dark:bg-donamed-primary/20 dark:text-donamed-secondary"
                                                : "text-[#5B5B5B] hover:bg-gray-100 hover:text-[#2D3748] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                        )
                                    }
                                >
                                    {sub.label}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>

                {menuItems.slice(6).map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-4 rounded-2xl px-6 py-2.5 text-lg font-medium transition-all",
                                isActive
                                    ? "bg-donamed-secondary/20 text-[#2D3748] shadow-[0px_20px_50px_rgba(55,69,87,0.1)] dark:bg-donamed-primary/20 dark:text-slate-100"
                                    : "text-[#404040] hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    className={cn(
                                        "h-8 w-8",
                                        isActive ? "text-[#2D3748]" : "text-[#404040]"
                                    )}
                                />
                                <span className={isActive ? "font-semibold" : "font-medium"}>
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Cerrar Sesión */}
                <button className="mt-5 flex items-center gap-4 rounded-2xl px-6 py-2.5 text-lg font-medium text-[#404040] transition-all hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800">
                    <LogOut className="h-8 w-8 rotate-180" />
                    <span>Cerrar Sesión</span>
                </button>
            </nav>
        </aside>
    );
}
