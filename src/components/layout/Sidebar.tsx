import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
    UserCircle,
    LogOut,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

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
    { icon: UserCircle, label: "Personas", path: "/personas" },
    
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const isCategoriasActive = location.pathname.startsWith("/categorias");
    const isUbicacionActive =
        location.pathname.startsWith("/ciudades") || location.pathname.startsWith("/provincias");
    const [categoriasOpen, setCategoriasOpen] = useState(isCategoriasActive);
    const [ubicacionOpen, setUbicacionOpen] = useState(isUbicacionActive);
    const categoriasExpanded = categoriasOpen || isCategoriasActive;
    const ubicacionExpanded = ubicacionOpen || isUbicacionActive;

    const handleLogout = () => {
        onClose();
        logout();
        navigate("/login", { replace: true });
    };

    const handleNavigate = () => {
        onClose();
    };

    return (
        <>
            <button
                type="button"
                aria-label="Cerrar menú lateral"
                onClick={onClose}
                className={cn(
                    "fixed inset-0 z-30 bg-[#1E293B]/45 backdrop-blur-sm transition-opacity xl:hidden",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
            />

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-[min(85vw,320px)] overflow-y-auto border-r border-[#EEF1F4] bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-[#111927] xl:w-[320px] xl:translate-x-0",
                    isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full xl:shadow-none"
                )}
            >
                <div className="flex min-h-full flex-col">
                    <div className="flex h-20 items-center justify-between px-5 sm:px-6">
                        <img
                            src="/logos/donamed_logo_header.png"
                            alt="DONAMED"
                            className="h-12 object-contain dark:hidden"
                        />
                        <img
                            src="/logos/donamed-negativo.png"
                            alt="DONAMED"
                            className="hidden h-12 object-contain dark:block"
                        />
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#5B5B5B] transition hover:bg-[#F3F6F8] dark:text-slate-300 dark:hover:bg-white/5 xl:hidden"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <nav className="mt-3 flex flex-1 flex-col gap-1 px-4 pb-6 sm:px-5 xl:px-6">
                        {menuItems.slice(0, 6).map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={handleNavigate}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all xl:gap-4 xl:rounded-2xl xl:px-6 xl:py-2.5 xl:text-lg",
                                        isActive
                                            ? "bg-donamed-secondary/20 text-[#2D3748] shadow-[0px_20px_50px_rgba(55,69,87,0.1)] dark:bg-cyan-400/12 dark:text-slate-100 dark:shadow-[0_18px_36px_rgba(2,6,23,0.28)]"
                                            : "text-[#404040] hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/5"
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon
                                            className={cn(
                                                "h-5 w-5 shrink-0 xl:h-8 xl:w-8",
                                                isActive ? "text-[#2D3748] dark:text-[#87e2ec]" : "text-[#404040] dark:text-slate-400"
                                            )}
                                        />
                                        <span className={isActive ? "font-semibold" : "font-medium"}>
                                            {item.label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        ))}

                        <div className="flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={() => setCategoriasOpen(!categoriasOpen)}
                                className={cn(
                                    "flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-base font-medium transition-all xl:gap-4 xl:rounded-2xl xl:px-6 xl:py-2.5 xl:text-lg",
                                    isCategoriasActive
                                        ? "bg-donamed-secondary/20 text-[#2D3748] shadow-[0px_20px_50px_rgba(55,69,87,0.1)] dark:bg-cyan-400/12 dark:text-slate-100 dark:shadow-[0_18px_36px_rgba(2,6,23,0.28)]"
                                        : "text-[#404040] hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/5"
                                )}
                            >
                                <div className="flex items-center gap-3 xl:gap-4">
                                    <FolderTree
                                        className={cn(
                                            "h-5 w-5 shrink-0 xl:h-8 xl:w-8",
                                            isCategoriasActive ? "text-[#2D3748] dark:text-[#87e2ec]" : "text-[#404040] dark:text-slate-400"
                                        )}
                                    />
                                    <span className={isCategoriasActive ? "font-semibold" : "font-medium"}>
                                        Categorías
                                    </span>
                                </div>
                                <ChevronDown
                                    className={cn(
                                        "h-5 w-5 shrink-0 text-[#5B5B5B] transition-transform",
                                        categoriasExpanded && "rotate-180"
                                    )}
                                />
                            </button>
                            {categoriasExpanded && (
                                <div className="ml-4 flex flex-col gap-1 border-l-2 border-[#E7E7E7] pl-3 dark:border-slate-600 xl:ml-6 xl:pl-4">
                                    {categoriasSubItems.map((sub) => (
                                        <NavLink
                                            key={sub.path}
                                            to={sub.path}
                                            onClick={handleNavigate}
                                            className={({ isActive }) =>
                                                cn(
                                                    "rounded-xl px-4 py-2 text-sm font-medium transition-all xl:text-base",
                                                    isActive
                                                        ? "bg-donamed-secondary/20 font-semibold text-donamed-dark dark:bg-cyan-400/10 dark:text-[#9deaf1]"
                                                        : "text-[#5B5B5B] hover:bg-gray-100 hover:text-[#2D3748] dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200"
                                                )
                                            }
                                        >
                                            {sub.label}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={() => setUbicacionOpen(!ubicacionOpen)}
                                className={cn(
                                    "flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-base font-medium transition-all xl:gap-4 xl:rounded-2xl xl:px-6 xl:py-2.5 xl:text-lg",
                                    isUbicacionActive
                                        ? "bg-donamed-secondary/20 text-[#2D3748] shadow-[0px_20px_50px_rgba(55,69,87,0.1)] dark:bg-cyan-400/12 dark:text-slate-100 dark:shadow-[0_18px_36px_rgba(2,6,23,0.28)]"
                                        : "text-[#404040] hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/5"
                                )}
                            >
                                <div className="flex items-center gap-3 xl:gap-4">
                                    <MapPin
                                        className={cn(
                                            "h-5 w-5 shrink-0 xl:h-8 xl:w-8",
                                            isUbicacionActive ? "text-[#2D3748] dark:text-[#87e2ec]" : "text-[#404040] dark:text-slate-400"
                                        )}
                                    />
                                    <span className={isUbicacionActive ? "font-semibold" : "font-medium"}>
                                        Ubicación
                                    </span>
                                </div>
                                <ChevronDown
                                    className={cn(
                                        "h-5 w-5 shrink-0 text-[#5B5B5B] transition-transform",
                                        ubicacionExpanded && "rotate-180"
                                    )}
                                />
                            </button>
                            {ubicacionExpanded && (
                                <div className="ml-4 flex flex-col gap-1 border-l-2 border-[#E7E7E7] pl-3 dark:border-slate-600 xl:ml-6 xl:pl-4">
                                    {ubicacionSubItems.map((sub) => (
                                        <NavLink
                                            key={sub.path}
                                            to={sub.path}
                                            onClick={handleNavigate}
                                            className={({ isActive }) =>
                                                cn(
                                                    "rounded-xl px-4 py-2 text-sm font-medium transition-all xl:text-base",
                                                    isActive
                                                        ? "bg-donamed-secondary/20 font-semibold text-donamed-dark dark:bg-cyan-400/10 dark:text-[#9deaf1]"
                                                        : "text-[#5B5B5B] hover:bg-gray-100 hover:text-[#2D3748] dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200"
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
                                onClick={handleNavigate}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all xl:gap-4 xl:rounded-2xl xl:px-6 xl:py-2.5 xl:text-lg",
                                        isActive
                                            ? "bg-donamed-secondary/20 text-[#2D3748] shadow-[0px_20px_50px_rgba(55,69,87,0.1)] dark:bg-cyan-400/12 dark:text-slate-100 dark:shadow-[0_18px_36px_rgba(2,6,23,0.28)]"
                                            : "text-[#404040] hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/5"
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon
                                            className={cn(
                                                "h-5 w-5 shrink-0 xl:h-8 xl:w-8",
                                                isActive ? "text-[#2D3748] dark:text-[#87e2ec]" : "text-[#404040] dark:text-slate-400"
                                            )}
                                        />
                                        <span className={isActive ? "font-semibold" : "font-medium"}>
                                            {item.label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        ))}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-6 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-[#404040] transition-all hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/5 xl:mt-8 xl:gap-4 xl:rounded-2xl xl:px-6 xl:py-4 xl:text-lg"
                        >
                            <LogOut className="h-5 w-5 rotate-180 xl:h-8 xl:w-8" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </nav>
                </div>
            </aside>
        </>
    );
}
