import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual login logic
        navigate("/dashboard");
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-donamed-dark via-[#1B6E79] to-donamed-primary">
            {/* Decorative blurs */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-donamed-secondary/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-white/20 blur-3xl" />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
                <div className="grid w-full max-w-6xl items-stretch gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Branding / Metrics */}
                    <div className="flex flex-col justify-center rounded-3xl bg-white/10 p-10 text-white shadow-[0px_30px_80px_-40px_rgba(0,0,0,0.45)] backdrop-blur animate-in fade-in-0 slide-in-from-left-6 duration-700">
                        <img
                            src="/logos/donamed_logo_header.png"
                            alt="DONAMED"
                            className="h-12 w-fit object-contain"
                        />
                        <h1 className="mt-6 text-3xl font-semibold leading-tight md:text-4xl">
                            Bienvenido al Panel Administrativo DONAMED
                        </h1>
                        <p className="mt-4 text-base text-white/80 md:text-lg">
                            Control y métricas en tiempo real para gestionar solicitudes, usuarios y
                            medicamentos con una experiencia moderna.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            {[
                                { label: "Solicitudes", value: "24.8K" },
                                { label: "Usuarios", value: "12.4K" },
                                { label: "SLA", value: "98.7%" },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4"
                                >
                                    <p className="text-sm text-white/70">{item.label}</p>
                                    <p className="text-2xl font-semibold">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
                            <span className="rounded-full border border-white/15 px-4 py-2">
                                Seguridad avanzada
                            </span>
                            <span className="rounded-full border border-white/15 px-4 py-2">
                                Reportes inteligentes
                            </span>
                            <span className="rounded-full border border-white/15 px-4 py-2">
                                Operación 24/7
                            </span>
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="flex items-center">
                        <div className="w-full rounded-3xl bg-white p-10 shadow-[0px_25px_60px_-15px_rgba(0,0,0,0.35)] animate-in fade-in-0 zoom-in-95 duration-700 delay-150">
                            <div className="mb-6">
                                <p className="text-sm font-medium uppercase tracking-[0.3em] text-donamed-primary/70">
                                    Acceso administrativo
                                </p>
                                <h2 className="mt-2 text-3xl font-semibold text-[#1E1E1E]">
                                    Inicia sesión
                                </h2>
                                <p className="mt-2 text-sm text-[#5B5B5B]">
                                    Ingresa con tus credenciales para continuar.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-[#404040]">
                                        Correo electrónico
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@donamed.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 rounded-xl border-[#E7E7E7] bg-[#F9F9F9] px-4 text-base placeholder:text-[#5B5B5B]/40 focus-visible:ring-donamed-primary"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-[#404040]">
                                        Contraseña
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-12 rounded-xl border-[#E7E7E7] bg-[#F9F9F9] px-4 pr-12 text-base placeholder:text-[#5B5B5B]/40 focus-visible:ring-donamed-primary"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B5B5B]/60 transition hover:text-[#5B5B5B]"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 text-[#5B5B5B]">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-[#D8D8D8] text-donamed-primary focus:ring-donamed-primary"
                                        />
                                        Recordarme
                                    </label>
                                    <a
                                        href="/forgot-password"
                                        className="font-medium text-donamed-primary hover:underline"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>

                                <Button
                                    type="submit"
                                    className="h-12 w-full rounded-xl bg-donamed-primary text-base font-semibold hover:bg-donamed-dark"
                                >
                                    Iniciar sesión
                                </Button>
                            </form>

                            <p className="mt-8 text-center text-xs text-[#5B5B5B]/60">
                                © 2025 DONAMED. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
