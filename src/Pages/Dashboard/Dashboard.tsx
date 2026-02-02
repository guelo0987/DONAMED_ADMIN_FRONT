import { Download, DollarSign, FileText, CheckCircle, UserPlus } from "lucide-react";
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
import type { Solicitud } from "@/components/dashboard";

// Sample data
const solicitudesData: Solicitud[] = [
    {
        id: "1",
        numeroSolicitud: "S-023869869",
        fecha: "24/09/2025",
        solicitante: "María del Carmen",
        status: "pendiente",
    },
    {
        id: "2",
        numeroSolicitud: "S-8596321474",
        fecha: "15/05/2025",
        solicitante: "María del Carmen",
        status: "aprobado",
    },
    {
        id: "3",
        numeroSolicitud: "S-7412589632",
        fecha: "12/12/2025",
        solicitante: "María del Carmen",
        status: "rechazado",
    },
    {
        id: "4",
        numeroSolicitud: "S-3098521474",
        fecha: "16/12/2025",
        solicitante: "María del Carmen",
        status: "incompleto",
    },
];

const barChartData = [
    { label: "1", value1: 60, value2: 40 },
    { label: "2", value1: 80, value2: 50 },
    { label: "3", value1: 50, value2: 30 },
    { label: "4", value1: 70, value2: 45 },
    { label: "5", value1: 90, value2: 60 },
    { label: "6", value1: 65, value2: 40 },
];

export function Dashboard() {
    return (
        <div className="flex gap-6">
            {/* Left Column */}
            <div className="flex flex-1 flex-col gap-6">
                {/* Solicitudes de hoy */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Solicitudes de hoy</CardTitle>
                            <p className="mt-1 text-base text-[#5B5B5B]/80">
                                Resumen de Solicitudes
                            </p>
                        </div>
                        <Button className="h-10 gap-2 rounded-lg bg-donamed-primary px-4">
                            <Download className="h-4 w-4" />
                            Exportar
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <div className="flex gap-5">
                            <StatsCard
                                icon={DollarSign}
                                value={5}
                                label="Total de Donaciones"
                                variant="light"
                            />
                            <StatsCard
                                icon={FileText}
                                value={300}
                                label="Solicitudes"
                                subLabel="+5% from yesterday"
                                variant="primary"
                            />
                            <StatsCard
                                icon={CheckCircle}
                                value={5}
                                label="Aprobaciones"
                                subLabel="+1,2% from yesterday"
                                variant="light"
                            />
                            <StatsCard
                                icon={UserPlus}
                                value={8}
                                label="Nuevos Registros"
                                subLabel="0,5% from yesterday"
                                variant="light"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Solicitudes Recientes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Solicitudes Recientes</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <SolicitudesTable solicitudes={solicitudesData} />
                    </CardContent>
                </Card>

                {/* Insights */}
                <Card className="h-[348px]">
                    <CardContent className="h-full p-6">
                        <AreaChart title="Insights" />
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="flex w-[420px] flex-col gap-6">
                {/* Solicitudes vs Medicamentos */}
                <Card className="h-[349px]">
                    <CardContent className="h-full p-6">
                        <BarChart
                            title="Solicitudes vs Medicamentos"
                            data={barChartData}
                            legend1="Solicitudes"
                            legend2="Medicamentos"
                            legend1Value={500}
                            legend2Value={635}
                        />
                    </CardContent>
                </Card>

                {/* Solicitudes Entrantes */}
                <Card className="h-[351px]">
                    <CardContent className="h-full p-6">
                        <LineChart title="Solicitudes Entrantes" />
                    </CardContent>
                </Card>

                {/* Solicitudes por Mes */}
                <Card className="h-[351px]">
                    <CardContent className="h-full p-6">
                        <WeeklyChart title="Solicitudes por Mes" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
