import { useLocation } from "react-router-dom";
import { Search, ChevronDown, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    "/dashboard": "Dashboard",
    "/solicitudes": "",
    "/donaciones": "",
    "/inventario": "",
    "/inventario/almacen": "",
    "/inventario/movimientos": "",
    "/despachos": "",
    "/despachos/historial": "",
    "/proveedores": "",
    "/medicamentos": "",
    "/categorias": "",
    "/categorias-enfermedades": "",
    "/ciudades": "",
    "/provincias": "",
    "/usuarios": "Usuarios",
    "/configuracion": "Configuración",
};

export function Header() {
    const location = useLocation();
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const title =
        pageTitles[location.pathname] ??
        (location.pathname.startsWith("/inventario")
            ? "Inventario"
            : location.pathname.startsWith("/donaciones")
              ? ""
              : location.pathname.startsWith("/despachos")
                ? "Despachos"
                : location.pathname.startsWith("/proveedores")
                  ? "Proveedores"
                  : location.pathname.startsWith("/categorias-enfermedades")
                    ? ""
                    : location.pathname.startsWith("/categorias")
                      ? ""
                      : location.pathname.startsWith("/ciudades")
                        ? ""
                        : location.pathname.startsWith("/provincias")
                          ? ""
                          : location.pathname.startsWith("/medicamentos")
                      ? ""
                      : "Dashboard");

    return (
        <header className="fixed left-[345px] right-0 top-0 z-30 flex h-[120px] items-center justify-between bg-white px-8 transition-colors dark:bg-[#1e293b]">
            {/* Page Title */}
            <h1 className="text-4xl font-semibold text-[#404040] dark:text-slate-100">{title}</h1>

            {/* Search Bar */}
            <div className="group flex h-[60px] w-[460px] items-center gap-3 rounded-2xl border border-[#E7E7E7] bg-white px-4 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light dark:border-slate-600 dark:bg-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                    <Search className="h-5 w-5" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar en el panel"
                    className="flex-1 bg-transparent text-base text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-400"
                />
            </div>

            {/* Right: Theme Toggle + User Menu */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-[#5B5B5B] transition hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700"
                    title={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
                >
                    {theme === "light" ? (
                        <Moon className="h-5 w-5" />
                    ) : (
                        <Sun className="h-5 w-5" />
                    )}
                </button>
                {/* Avatar */}
                <div className="h-[60px] w-[60px] overflow-hidden rounded-2xl bg-gray-200">
                    <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face"
                        alt="Admin avatar"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* User Info */}
                <div className="flex flex-col">
                    <span className="text-base font-medium text-[#404040] dark:text-slate-200">
                        {user?.nombre ?? user?.correo?.split("@")[0] ?? "Usuario"}
                    </span>
                    <span className="text-sm text-[#5B5B5B]/50 dark:text-slate-400">{user?.rol ?? "Admin"}</span>
                </div>

                {/* Dropdown Arrow */}
                <ChevronDown className="h-4 w-4 text-[#151D48] dark:text-slate-400" />
            </div>
        </header>
    );
}
