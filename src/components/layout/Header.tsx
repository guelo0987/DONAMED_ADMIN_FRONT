import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, ChevronDown, Sun, Moon, Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

interface SearchItem {
    label: string;
    path: string;
    description: string;
    keywords: string[];
}

const SEARCH_ITEMS: SearchItem[] = [
    { label: "Dashboard", path: "/", description: "Vista general del panel", keywords: ["inicio", "panel", "dashboard", "resumen"] },
    { label: "Solicitudes", path: "/solicitudes", description: "Gestionar solicitudes", keywords: ["solicitud", "medicamentos", "aprobaciones"] },
    { label: "Donaciones", path: "/donaciones", description: "Listado de donaciones", keywords: ["donacion", "donaciones", "proveedor"] },
    { label: "Nueva donación", path: "/donaciones/nueva", description: "Registrar una donación", keywords: ["crear donacion", "registro donacion", "nueva donacion"] },
    { label: "Inventario", path: "/inventario", description: "Inventario general", keywords: ["stock", "inventario", "lotes"] },
    { label: "Inventario por almacén", path: "/inventario/almacen", description: "Ver inventario por almacén", keywords: ["almacen", "inventario almacen"] },
    { label: "Ajustar inventario", path: "/inventario/movimientos", description: "Registrar movimientos de inventario", keywords: ["ajuste", "movimientos", "entrada", "salida"] },
    { label: "Despachos", path: "/despachos", description: "Solicitudes listas para despacho", keywords: ["despacho", "despachos", "aprobar"] },
    { label: "Historial de despachos", path: "/despachos/historial", description: "Ver despachos realizados", keywords: ["historial", "despachos realizados"] },
    { label: "Proveedores", path: "/proveedores", description: "Listado de proveedores", keywords: ["proveedor", "rnc"] },
    { label: "Nuevo proveedor", path: "/proveedores/nuevo", description: "Registrar proveedor", keywords: ["crear proveedor", "registrar proveedor"] },
    { label: "Medicamentos", path: "/medicamentos", description: "Gestión de medicamentos", keywords: ["medicamento", "farmaco", "compuesto"] },
    { label: "Nuevo medicamento", path: "/medicamentos/nuevo", description: "Registrar medicamento", keywords: ["crear medicamento", "registrar medicamento"] },
    { label: "Categorías de medicamentos", path: "/categorias", description: "Gestionar categorías", keywords: ["categorias", "categoria medicamento"] },
    { label: "Categorías de enfermedades", path: "/categorias-enfermedades", description: "Gestionar categorías de enfermedades", keywords: ["enfermedades", "categoria enfermedad"] },
    { label: "Ciudades", path: "/ciudades", description: "Gestionar ciudades", keywords: ["ciudad", "ciudades", "ubicacion"] },
    { label: "Provincias", path: "/provincias", description: "Gestionar provincias", keywords: ["provincia", "provincias", "ubicacion"] },
    { label: "Usuarios", path: "/usuarios", description: "Administrar usuarios", keywords: ["usuario", "usuarios", "rol"] },
    { label: "Nuevo usuario", path: "/usuarios/nuevo", description: "Registrar usuario", keywords: ["crear usuario", "registrar usuario"] },
    { label: "Personas", path: "/personas", description: "Gestionar personas", keywords: ["persona", "personas", "cedula"] },
    { label: "Nueva persona", path: "/personas/nueva", description: "Registrar persona", keywords: ["crear persona", "registrar persona"] },
];

function getHeaderTitle(pathname: string): string {
    if (pathname === "/" || pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/usuarios")) return "Usuarios";
    return "";
}

interface HeaderProps {
    onMenuToggle: () => void;
}

function PanelSearch() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!searchRef.current?.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredItems = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) {
            return SEARCH_ITEMS.slice(0, 8);
        }

        return SEARCH_ITEMS.filter((item) => {
            const haystack = [item.label, item.description, item.path, ...item.keywords]
                .join(" ")
                .toLowerCase();
            return haystack.includes(query);
        }).slice(0, 8);
    }, [searchTerm]);

    const handleSelectItem = (item: SearchItem) => {
        navigate(item.path);
        setSearchTerm("");
        setIsSearchOpen(false);
    };

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            setIsSearchOpen(false);
            return;
        }

        if (event.key === "Enter" && filteredItems.length > 0) {
            event.preventDefault();
            handleSelectItem(filteredItems[0]);
        }
    };

    return (
        <div ref={searchRef} className="order-3 w-full xl:order-2 xl:w-auto xl:flex-1 xl:max-w-[460px]">
            <div className="relative">
                <div className="group flex h-12 w-full items-center gap-3 rounded-2xl border border-[#E7E7E7] bg-white px-4 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light dark:border-slate-700/80 dark:bg-[#182233] dark:shadow-[0_18px_36px_rgba(2,6,23,0.22)] xl:h-[60px]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white dark:bg-[#102033] dark:text-[#7ad7e2] xl:h-10 xl:w-10">
                        <Search className="h-5 w-5" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsSearchOpen(true)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Buscar módulo o acción"
                        className="flex-1 bg-transparent text-sm text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 xl:text-base"
                    />
                </div>

                {isSearchOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 overflow-hidden rounded-2xl border border-[#E7E7E7] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)] dark:border-slate-700/80 dark:bg-[#182233] dark:shadow-[0_28px_60px_rgba(2,6,23,0.42)]">
                        {filteredItems.length > 0 ? (
                            <div className="max-h-[320px] overflow-y-auto py-2">
                                {filteredItems.map((item) => (
                                    <button
                                        key={item.path}
                                        type="button"
                                        onClick={() => handleSelectItem(item)}
                                        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-[#F7FBFC] dark:hover:bg-white/5"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-[#2D3748] dark:text-slate-100">
                                                {item.label}
                                            </p>
                                            <p className="truncate text-xs text-[#7B8794] dark:text-slate-400">
                                                {item.description}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-[#F3F8FB] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#6F86AA] dark:bg-[#102033] dark:text-[#96dfea]">
                                            {item.path}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-5 text-sm text-[#7B8794] dark:text-slate-400">
                                No se encontraron módulos o acciones para esa búsqueda.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export function Header({ onMenuToggle }: HeaderProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const title = getHeaderTitle(location.pathname);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!userMenuRef.current?.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsUserMenuOpen(false);
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className="fixed inset-x-0 top-0 z-30 border-b border-[#EEF1F4] bg-white/95 backdrop-blur-sm transition-colors dark:border-slate-800 dark:bg-[#101826]/95 xl:left-[320px]">
            <div className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-6 xl:px-8">
                <div className={cn("flex min-w-0 items-center gap-3", title && "flex-1")}>
                    <button
                        type="button"
                        onClick={onMenuToggle}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E7E7] bg-white text-[#404040] shadow-sm transition hover:bg-[#F7F9FB] dark:border-slate-700/80 dark:bg-[#182233] dark:text-slate-100 dark:hover:bg-white/5 xl:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    {title && (
                        <h1 className="truncate text-2xl font-semibold text-[#404040] dark:text-slate-100 sm:text-3xl xl:text-4xl">
                            {title}
                        </h1>
                    )}
                </div>

                <PanelSearch key={location.pathname} />

                <div className="order-2 ml-auto flex items-center gap-2 sm:gap-3 xl:order-3 xl:ml-0 xl:gap-4">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-[#5B5B5B] transition hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/5"
                        title={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
                    >
                        {theme === "light" ? (
                            <Moon className="h-5 w-5" />
                        ) : (
                            <Sun className="h-5 w-5" />
                        )}
                    </button>
                    <div ref={userMenuRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setIsUserMenuOpen((current) => !current)}
                            className="flex items-center gap-2 rounded-2xl px-1 py-1 transition hover:bg-[#F7F9FB] dark:hover:bg-white/5 sm:gap-3"
                            aria-haspopup="menu"
                            aria-expanded={isUserMenuOpen}
                            aria-label="Abrir menú de usuario"
                        >
                            <div className="h-11 w-11 overflow-hidden rounded-2xl bg-gray-200 ring-1 ring-transparent transition dark:ring-white/10 sm:h-[52px] sm:w-[52px] xl:h-[60px] xl:w-[60px]">
                                <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face"
                                    alt="Admin avatar"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="hidden min-w-0 flex-col sm:flex">
                                <span className="truncate text-sm font-medium text-[#404040] dark:text-slate-200 xl:text-base">
                                    {user?.nombre ?? user?.correo?.split("@")[0] ?? "Usuario"}
                                </span>
                                <span className="truncate text-xs text-[#5B5B5B]/50 dark:text-slate-400 xl:text-sm">
                                    {user?.rol ?? "Admin"}
                                </span>
                            </div>
                            <ChevronDown
                                className={cn(
                                    "hidden h-4 w-4 text-[#151D48] transition-transform dark:text-slate-400 sm:block",
                                    isUserMenuOpen && "rotate-180"
                                )}
                            />
                        </button>

                        {isUserMenuOpen && (
                            <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-[220px] overflow-hidden rounded-2xl border border-[#E7E7E7] bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.14)] dark:border-slate-700/80 dark:bg-[#182233] dark:shadow-[0_28px_60px_rgba(2,6,23,0.42)]">
                                <div className="rounded-xl px-3 py-2">
                                    <p className="truncate text-sm font-semibold text-[#2D3748] dark:text-slate-100">
                                        {user?.nombre ?? user?.correo?.split("@")[0] ?? "Usuario"}
                                    </p>
                                    <p className="truncate text-xs text-[#7B8794] dark:text-slate-400">
                                        {user?.correo ?? "Sin correo"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-[#C2410C] transition hover:bg-[#FFF7ED] dark:text-orange-300 dark:hover:bg-orange-500/10"
                                >
                                    <LogOut className="h-4 w-4 rotate-180" />
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
