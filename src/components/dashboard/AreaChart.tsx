interface AreaChartProps {
    title: string;
}

export function AreaChart({ title }: AreaChartProps) {
    // Sample data for multi-line area chart
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Sept", "Oct", "Nov", "Des"];

    const yLabels = [0, 100, 200, 300, 400];

    return (
        <div className="flex h-full flex-col">
            {/* Title */}
            <h3 className="text-xl font-semibold text-[#2D3748]">{title}</h3>

            {/* Chart Area */}
            <div className="relative mt-4 flex-1">
                {/* Y-axis labels */}
                <div className="absolute -left-2 top-0 flex h-[164px] flex-col-reverse justify-between text-right text-xs text-[#7B91B0]/70">
                    {yLabels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>

                {/* Chart SVG */}
                <div className="ml-8">
                    <svg viewBox="0 0 500 180" className="h-[180px] w-full">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map((i) => (
                            <line
                                key={i}
                                x1="0"
                                y1={i * 41}
                                x2="500"
                                y2={i * 41}
                                stroke="rgba(70, 78, 95, 0.04)"
                            />
                        ))}

                        {/* Dashed vertical line */}
                        <line
                            x1="380"
                            y1="0"
                            x2="380"
                            y2="164"
                            stroke="#9D9D9D"
                            strokeDasharray="4 4"
                        />
                        <circle cx="380" cy="50" r="7" fill="#9D9D9D" />

                        {/* Line 1 - Donaciones (teal) */}
                        <path
                            d="M 0 82 Q 50 70 100 75 T 200 60 T 300 72 T 400 45 T 500 50"
                            fill="none"
                            stroke="#34A4B3"
                            strokeWidth="4"
                        />

                        {/* Line 2 - Usuarios (gray) */}
                        <path
                            d="M 0 100 Q 50 92 100 95 T 200 90 T 300 100 T 400 85 T 500 110"
                            fill="none"
                            stroke="#9D9D9D"
                            strokeWidth="4"
                        />

                        {/* Line 3 - Número de solicitudes (cyan) */}
                        <path
                            d="M 0 40 Q 50 35 100 42 T 200 30 T 300 38 T 400 25 T 500 35"
                            fill="none"
                            stroke="#40C9DB"
                            strokeWidth="4"
                        />
                    </svg>

                    {/* X-axis labels */}
                    <div className="mt-2 flex justify-between text-[10px] text-[#464E5F]">
                        {months.map((month) => (
                            <span key={month}>{month}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-donamed-primary" />
                    <span className="text-xs font-medium text-[#464E5F]">Donaciones</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-[#9D9D9D]" />
                    <span className="text-xs font-medium text-[#464E5F]">Usuarios</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-donamed-secondary" />
                    <span className="text-xs font-medium text-[#464E5F]">Número de solicitudes</span>
                </div>
            </div>
        </div>
    );
}
