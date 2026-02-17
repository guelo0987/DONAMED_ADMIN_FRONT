interface DayStat {
    dia: string;
    solicitudes: number;
    medicamentos: number;
}

interface WeeklyChartProps {
    title: string;
    data?: DayStat[];
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

    return (
        <div className="flex h-full flex-col">
            <h3 className="text-xl font-semibold text-[#2D3748]">{title}</h3>

            <div className="relative mt-4 flex-1">
                {/* Y-axis labels */}
                <div className="absolute -left-2 top-0 flex h-[176px] flex-col-reverse justify-between text-right text-xs text-[#7B91B0]">
                    {yLabels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>

                {/* Grid lines and bars */}
                <div className="ml-10">
                    <svg viewBox="0 0 580 200" className="h-[200px] w-full">
                        {/* Horizontal grid lines */}
                        {Array.from({ length: ySteps + 1 }).map((_, i) => (
                            <line
                                key={i}
                                x1="0"
                                y1={i * 32}
                                x2="580"
                                y2={i * 32}
                                stroke="#EFF1F3"
                            />
                        ))}

                        {/* Bars */}
                        {chartData.map((values: number[], index: number) => {
                            const x = index * 80 + 30;
                            const height1 = (values[0] / maxValue) * 160;
                            const height2 = (values[1] / maxValue) * 160;

                            return (
                                <g key={index}>
                                    <rect
                                        x={x}
                                        y={176 - height1}
                                        width="14"
                                        height={Math.max(height1, 0)}
                                        rx="2"
                                        fill="#34A4B3"
                                    />
                                    <rect
                                        x={x + 16}
                                        y={176 - height2}
                                        width="14"
                                        height={Math.max(height2, 0)}
                                        rx="2"
                                        fill="#40C9DB"
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    {/* X-axis labels */}
                    <div className="mt-2 flex justify-around text-xs text-[#7B91B0]">
                        {days.map((day) => (
                            <span key={day}>{day}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded bg-donamed-primary" />
                    <span className="text-xs text-[#222B45]">Solicitudes</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded bg-donamed-secondary" />
                    <span className="text-xs text-[#222B45]">Medicamentos</span>
                </div>
            </div>
        </div>
    );
}
