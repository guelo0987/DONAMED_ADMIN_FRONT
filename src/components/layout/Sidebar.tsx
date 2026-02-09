import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    HandHeart,
    Pill,
    Users,
    Settings,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: FileText, label: "Solicitudes", path: "/solicitudes" },
    { icon: HandHeart, label: "Donaciones", path: "/donaciones" },
    { icon: Pill, label: "Medicamentos", path: "/medicamentos" },
    { icon: Users, label: "Usuarios", path: "/usuarios" },
    { icon: Settings, label: "Configuración", path: "/configuracion" },
];

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-[345px] bg-white">
            {/* Logo */}
            <div className="flex h-[100px] items-center justify-center px-6">
                <img
                    src="/logos/donamed_logo_header.png"
                    alt="DONAMED"
                    className="h-16 object-contain"
                />
            </div>

            {/* Navigation */}
            <nav className="mt-8 flex flex-col gap-2 px-[46px]">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-4 rounded-2xl px-6 py-4 text-lg font-medium transition-all",
                                isActive
                                    ? "bg-donamed-secondary/20 text-[#2D3748] shadow-[0px_20px_50px_rgba(55,69,87,0.1)]"
                                    : "text-[#404040] hover:bg-gray-100"
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
                <button className="mt-8 flex items-center gap-4 rounded-2xl px-6 py-4 text-lg font-medium text-[#404040] transition-all hover:bg-gray-100">
                    <LogOut className="h-8 w-8 rotate-180" />
                    <span>Cerrar Sesión</span>
                </button>
            </nav>
        </aside>
    );
}
