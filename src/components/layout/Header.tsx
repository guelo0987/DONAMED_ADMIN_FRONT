import { useLocation } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";

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
    "/medicamentos": "Medicamentos",
    "/usuarios": "Usuarios",
    "/configuracion": "Configuración",
};

export function Header() {
    const location = useLocation();
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
                : "Dashboard");

    return (
        <header className="fixed left-[345px] right-0 top-0 z-30 flex h-[120px] items-center justify-between bg-white px-8">
            {/* Page Title */}
            <h1 className="text-4xl font-semibold text-[#404040]">{title}</h1>

            {/* Search Bar */}
            <div className="group flex h-[60px] w-[460px] items-center gap-3 rounded-2xl border border-[#E7E7E7] bg-white px-4 shadow-sm transition hover:shadow-md focus-within:border-donamed-primary/40 focus-within:ring-4 focus-within:ring-donamed-light">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-donamed-light text-donamed-dark transition group-focus-within:bg-donamed-primary group-focus-within:text-white">
                    <Search className="h-5 w-5" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar en el panel"
                    className="flex-1 bg-transparent text-base text-[#404040] placeholder:text-[#5B5B5B]/50 focus:outline-none"
                />
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
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
                    <span className="text-base font-medium text-[#404040]">Carlos</span>
                    <span className="text-sm text-[#5B5B5B]/50">Admin</span>
                </div>

                {/* Dropdown Arrow */}
                <ChevronDown className="h-4 w-4 text-[#151D48]" />
            </div>
        </header>
    );
}
