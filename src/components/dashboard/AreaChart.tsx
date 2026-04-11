interface MonthlyStat {
    mes: string;
    total: number;
}

interface AreaChartProps {
    title: string;
    donaciones?: MonthlyStat[];
    usuarios?: MonthlyStat[];
    solicitudes?: MonthlyStat[];
}

export function AreaChart({ title, donaciones = [], usuarios = [], solicitudes = [] }: AreaChartProps) {
    const months = donaciones.length > 0
        ? donaciones.map((d) => d.mes)
        : ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const allValues = [
        ...donaciones.map((d) => d.total),
        ...usuarios.map((u) => u.total),
        ...solicitudes.map((s) => s.total),
    ];
    const maxValue = Math.max(...allValues, 1);

    const chartW = 500;
    const chartH = 164;
    const paddingBottom = 16;

    function toPath(data: MonthlyStat[]): string {
        if (data.length === 0) return "";
        const step = chartW / Math.max(data.length - 1, 1);
        return data
            .map((d, i) => {
                const x = i * step;
                const y = chartH - paddingBottom - (d.total / maxValue) * (chartH - paddingBottom);
                return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(" ");
    }

    // Dynamic Y labels
    const ySteps = 4;
    const yLabels = Array.from({ length: ySteps + 1 }, (_, i) =>
        Math.round((maxValue / ySteps) * i)
    );

    return (
        <div className="flex h-full flex-col">
            <h3 className="text-xl font-semibold text-[#2D3748] dark:text-slate-100">{title}</h3>

            <div className="relative mt-4 flex-1 rounded-[20px] dark:border dark:border-white/6 dark:bg-white/[0.02] dark:px-3 dark:py-4">
                {/* Y-axis labels */}
                <div className="absolute -left-2 top-0 flex h-[164px] flex-col-reverse justify-between text-right text-[10px] text-[#7B91B0]/70 dark:text-slate-500 sm:text-xs">
                    {yLabels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>

                <div className="ml-6 sm:ml-8">
                    <svg viewBox={`0 0 ${chartW} ${chartH + paddingBottom}`} className="h-[170px] w-full text-[#E9EFF5] dark:text-white/10 sm:h-[180px]">
                        {/* Grid lines */}
                        {Array.from({ length: ySteps + 1 }).map((_, i) => (
                            <line
                                key={i}
                                x1="0"
                                y1={i * (chartH / ySteps)}
                                x2={chartW}
                                y2={i * (chartH / ySteps)}
                                stroke="currentColor"
                            />
                        ))}

                        {/* Donaciones */}
                        {donaciones.length > 0 && (
                            <path d={toPath(donaciones)} fill="none" stroke="#34A4B3" strokeWidth="3" />
                        )}

                        {/* Usuarios */}
                        {usuarios.length > 0 && (
                            <path d={toPath(usuarios)} fill="none" stroke="#9D9D9D" strokeWidth="3" />
                        )}

                        {/* Solicitudes */}
                        {solicitudes.length > 0 && (
                            <path d={toPath(solicitudes)} fill="none" stroke="#40C9DB" strokeWidth="3" />
                        )}
                    </svg>

                    {/* X-axis labels */}
                    <div className="mt-2 flex justify-between text-[10px] text-[#464E5F] dark:text-slate-400">
                        {months.map((month) => (
                            <span key={month}>{month}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-donamed-primary" />
                    <span className="text-xs font-medium text-[#464E5F] dark:text-slate-300">Donaciones</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-[#9D9D9D]" />
                    <span className="text-xs font-medium text-[#464E5F] dark:text-slate-300">Usuarios</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-donamed-secondary" />
                    <span className="text-xs font-medium text-[#464E5F] dark:text-slate-300">Solicitudes</span>
                </div>
            </div>
        </div>
    );
}
