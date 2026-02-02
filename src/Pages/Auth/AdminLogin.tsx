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
        navigate("/");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#34A4B3] via-[#40C9DB] to-[#1C5961] p-4">
            {/* Login Card */}
            <div className="w-full max-w-[450px] rounded-3xl bg-white p-10 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center">
                    <img
                        src="/logos/donamed_logo_header.png"
                        alt="DONAMED"
                        className="h-14 object-contain"
                    />
                    <p className="mt-3 text-center text-lg text-[#5B5B5B]">
                        Panel de Administración
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-[#404040]">
                            Correo Electrónico
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@donamed.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 rounded-xl border-[#E7E7E7] bg-[#F9F9F9] px-4 text-base placeholder:text-[#5B5B5B]/40"
                            required
                        />
                    </div>

                    {/* Password */}
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
                                className="h-12 rounded-xl border-[#E7E7E7] bg-[#F9F9F9] px-4 pr-12 text-base placeholder:text-[#5B5B5B]/40"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B5B5B]/60 hover:text-[#5B5B5B]"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <a
                            href="/forgot-password"
                            className="text-sm font-medium text-donamed-primary hover:underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="h-12 w-full rounded-xl bg-donamed-primary text-base font-semibold hover:bg-donamed-dark"
                    >
                        Iniciar Sesión
                    </Button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-[#5B5B5B]/60">
                    © 2025 DONAMED. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}
