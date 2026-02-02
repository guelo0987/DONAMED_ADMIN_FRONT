interface WeeklyChartProps {
    title: string;
}

export function WeeklyChart({ title }: WeeklyChartProps) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const yLabels = ["0", "5k", "10k", "15k", "20k", "25k"];

    // Sample data for each day [value1, value2]
    const data = [
        [65, 50],
        [80, 70],
        [100, 85],
        [70, 60],
        [50, 45],
        [75, 65],
        [90, 75],
    ];

    const maxValue = 100;

    return (
        <div className="flex h-full flex-col">
            {/* Title */}
            <h3 className="text-xl font-semibold text-[#2D3748]">{title}</h3>

            {/* Chart Area */}
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
                        {[0, 1, 2, 3, 4, 5].map((i) => (
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
                        {data.map((values, index) => {
                            const x = index * 80 + 30;
                            const height1 = (values[0] / maxValue) * 160;
                            const height2 = (values[1] / maxValue) * 160;

                            return (
                                <g key={index}>
                                    {/* Bar 1 - Solicitudes */}
                                    <rect
                                        x={x}
                                        y={176 - height1}
                                        width="14"
                                        height={height1}
                                        rx="2"
                                        fill="#34A4B3"
                                    />
                                    {/* Bar 2 - Medicamentos */}
                                    <rect
                                        x={x + 16}
                                        y={176 - height2}
                                        width="14"
                                        height={height2}
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
