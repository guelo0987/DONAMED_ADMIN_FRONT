import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AdminLayout() {
    return (
        <div className="min-h-screen bg-[#F8F7F7]">
            <Sidebar />
            <Header />

            {/* Main Content */}
            <main className="ml-[345px] mt-[120px] min-h-[calc(100vh-120px)] p-8">
                <Outlet />
            </main>
        </div>
    );
}
