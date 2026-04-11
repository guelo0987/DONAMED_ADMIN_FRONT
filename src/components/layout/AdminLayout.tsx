import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isSidebarOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isSidebarOpen]);

    return (
        <div className="min-h-screen overflow-x-clip bg-[#F8F7F7] transition-colors dark:bg-[#0b1220]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <Header onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />

            <main className="min-w-0 px-4 pb-6 pt-32 sm:px-6 sm:pb-8 sm:pt-36 xl:ml-[320px] xl:min-h-screen xl:px-8 xl:pt-[152px]">
                <Outlet />
            </main>
        </div>
    );
}
