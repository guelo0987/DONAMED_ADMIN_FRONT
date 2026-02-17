import { useCallback, useEffect, useState } from "react";
import { Download, DollarSign, FileText, CheckCircle, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    StatsCard,
    SolicitudesTable,
    BarChart,
    LineChart,
    AreaChart,
    WeeklyChart,
} from "@/components/dashboard";
import { dashboardService, type DashboardData } from "@/services/dashboardService";

function formatVariacion(variacion: number): string {
    if (variacion === 0) return "Sin cambios";
    const sign = variacion > 0 ? "+" : "";
    return `${sign}${variacion}% vs ayer`;
}

export function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const stats = await dashboardService.getStats();
            setData(stats);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar el dashboard");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-donamed-primary" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="space-y-4 py-16 text-center">
                <p className="text-sm text-danger">{error ?? "No se pudieron cargar las estadísticas"}</p>
                <Button variant="outline" onClick={fetchData}>Reintentar</Button>
            </div>
        );
    }

    return (
        <div className="flex gap-6 animate-in fade-in-0 duration-700">
            {/* Left Column */}
            <div className="flex flex-1 flex-col gap-6">
                {/* Solicitudes de hoy */}
                <Card className="transition hover:-translate-y-0.5 hover:shadow-lg animate-in fade-in-0 slide-in-from-left-4 duration-700">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Solicitudes de hoy</CardTitle>
                            <p className="mt-1 text-base text-[#5B5B5B]/80">
                                Resumen de Solicitudes
                            </p>
                        </div>
                        <Button className="h-10 gap-2 rounded-lg bg-donamed-primary px-4 transition hover:shadow-md">
                            <Download className="h-4 w-4" />
                            Exportar
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <div className="flex gap-5">
                            <div className="animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
                                <StatsCard
                                    icon={DollarSign}
                                    value={data.cards.totalDonaciones}
                                    label="Total de Donaciones"
                                    variant="light"
                                />
                            </div>
                            <div className="animate-in fade-in-0 slide-in-from-bottom-3 duration-500 delay-100">
                                <StatsCard
                                    icon={FileText}
                                    value={data.cards.solicitudes.total}
                                    label="Solicitudes"
                                    subLabel={formatVariacion(data.cards.solicitudes.variacion)}
                                    variant="primary"
                                />
                            </div>
                            <div className="animate-in fade-in-0 slide-in-from-bottom-3 duration-500 delay-200">
                                <StatsCard
                                    icon={CheckCircle}
                                    value={data.cards.aprobaciones.total}
                                    label="Aprobaciones"
                                    subLabel={formatVariacion(data.cards.aprobaciones.variacion)}
                                    variant="light"
                                />
                            </div>
                            <div className="animate-in fade-in-0 slide-in-from-bottom-3 duration-500 delay-300">
                                <StatsCard
                                    icon={UserPlus}
                                    value={data.cards.nuevosRegistros.total}
                                    label="Nuevos Registros"
                                    subLabel={formatVariacion(data.cards.nuevosRegistros.variacion)}
                                    variant="light"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Solicitudes Recientes */}
                <Card className="transition hover:-translate-y-0.5 hover:shadow-lg animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-100">
                    <CardHeader>
                        <CardTitle>Solicitudes Recientes</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <SolicitudesTable solicitudes={data.solicitudesRecientes} />
                    </CardContent>
                </Card>

                {/* Insights */}
                <Card className="h-[348px] transition hover:-translate-y-0.5 hover:shadow-lg animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-200">
                    <CardContent className="h-full p-6">
                        <AreaChart
                            title="Insights"
                            donaciones={data.insights.donaciones}
                            usuarios={data.insights.usuarios}
                            solicitudes={data.insights.solicitudes}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="flex w-[420px] flex-col gap-6">
                {/* Solicitudes vs Medicamentos */}
                <Card className="h-[349px] transition hover:-translate-y-0.5 hover:shadow-lg animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-100">
                    <CardContent className="h-full p-6">
                        <BarChart
                            title="Solicitudes vs Medicamentos"
                            legend1="Solicitudes"
                            legend2="Medicamentos"
                            legend1Value={data.solicitudesVsMedicamentos.solicitudes}
                            legend2Value={data.solicitudesVsMedicamentos.medicamentos}
                        />
                    </CardContent>
                </Card>

                {/* Solicitudes Entrantes */}
                <Card className="h-[351px] transition hover:-translate-y-0.5 hover:shadow-lg animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-200">
                    <CardContent className="h-full p-6">
                        <LineChart
                            title="Solicitudes Entrantes"
                            esteMes={data.solicitudesEntrantes.esteMes}
                            mesAnterior={data.solicitudesEntrantes.mesAnterior}
                        />
                    </CardContent>
                </Card>

                {/* Solicitudes por Día */}
                <Card className="h-[351px] transition hover:-translate-y-0.5 hover:shadow-lg animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-300">
                    <CardContent className="h-full p-6">
                        <WeeklyChart
                            title="Solicitudes por Día"
                            data={data.solicitudesPorDia}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
