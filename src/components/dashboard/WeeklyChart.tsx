interface DayStat {
    dia: string;
    solicitudes: number;
    medicamentos: number;
}

interface WeeklyChartProps {
    title: string;
    data?: DayStat[];
}

function formatDayLabel(day: string): string {
    const trimmed = day.trim();
    if (!trimmed) return "N/A";

    if (trimmed.length <= 3) {
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }

    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1, 3).toLowerCase() + ".";
}

export function WeeklyChart({ title, data = [] }: WeeklyChartProps) {
    const days = data.length > 0 ? data.map((d) => d.dia) : ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const chartData = data.length > 0
        ? data.map((d) => [d.solicitudes, d.medicamentos])
        : Array(7).fill([0, 0]);

    const maxValue = Math.max(
        ...chartData.flatMap((d: number[]) => d),
        1
    );

    const ySteps = 5;
    const yLabels = Array.from({ length: ySteps + 1 }, (_, i) =>
        Math.round((maxValue / ySteps) * i)
    );
    const chartHeight = 176;

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold text-[#2D3748] dark:text-slate-100">{title}</h3>
                <span className="rounded-full bg-[#F3F8FB] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7B91B0] dark:bg-[#102033] dark:text-[#95dee8]">
                    Semanal
                </span>
            </div>

            <div className="mt-5 grid flex-1 grid-cols-[34px_minmax(0,1fr)] gap-3">
                <div className="flex h-[176px] flex-col-reverse justify-between pb-1 text-right text-[10px] text-[#7B91B0] dark:text-slate-500 sm:text-xs">
                    {yLabels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>

                <div className="min-w-0">
                    <div className="relative h-[176px] rounded-[20px] dark:border dark:border-white/6 dark:bg-white/[0.02] dark:px-3 dark:py-2">
                        <div className="pointer-events-none absolute inset-0">
                            {Array.from({ length: ySteps + 1 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute inset-x-0 border-t border-[#EFF1F3] dark:border-white/10"
                                    style={{ top: `${(i / ySteps) * chartHeight}px` }}
                                />
                            ))}
                        </div>

                        <div className="relative grid h-full grid-cols-7 items-end gap-2 sm:gap-3">
                            {chartData.map((values: number[], index: number) => {
                                const height1 = (values[0] / maxValue) * 160;
                                const height2 = (values[1] / maxValue) * 160;

                                return (
                                    <div key={days[index] ?? index} className="flex h-full items-end justify-center">
                                        <div className="flex items-end gap-1 sm:gap-1.5">
                                            <div
                                                className="w-3 rounded-[4px] bg-donamed-primary shadow-[0_10px_24px_rgba(52,164,179,0.18)] sm:w-3.5"
                                                style={{ height: `${Math.max(height1, 2)}px` }}
                                            />
                                            <div
                                                className="w-3 rounded-[4px] bg-donamed-secondary shadow-[0_10px_24px_rgba(64,201,219,0.18)] sm:w-3.5"
                                                style={{ height: `${Math.max(height2, 2)}px` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-7 gap-2 sm:gap-3">
                        {days.map((day) => (
                            <div key={day} className="flex justify-center">
                                <span
                                    title={day}
                                    className="inline-flex min-w-[36px] justify-center rounded-full bg-[#F3F8FB] px-1.5 py-1 text-[10px] font-semibold text-[#6F86AA] dark:bg-[#102033] dark:text-[#95dee8] sm:min-w-[42px] sm:px-2"
                                >
                                    {formatDayLabel(day)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F8FAFC] px-3 py-1.5 dark:bg-[#102033]">
                    <div className="h-2.5 w-2.5 rounded-full bg-donamed-primary" />
                    <span className="text-xs font-medium text-[#222B45] dark:text-slate-100">Solicitudes</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F8FAFC] px-3 py-1.5 dark:bg-[#102033]">
                    <div className="h-2.5 w-2.5 rounded-full bg-donamed-secondary" />
                    <span className="text-xs font-medium text-[#222B45] dark:text-slate-100">Medicamentos</span>
                </div>
            </div>
        </div>
    );
}
