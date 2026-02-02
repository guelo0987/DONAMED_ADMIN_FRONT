interface LineChartProps {
    title: string;
}

export function LineChart({ title }: LineChartProps) {
    // Sample data points for the lines
    const line1Points = [
        { x: 0, y: 60 },
        { x: 60, y: 40 },
        { x: 120, y: 55 },
        { x: 180, y: 45 },
        { x: 240, y: 50 },
        { x: 300, y: 48 },
        { x: 360, y: 42 },
    ];

    const line2Points = [
        { x: 0, y: 80 },
        { x: 60, y: 70 },
        { x: 120, y: 75 },
        { x: 180, y: 65 },
        { x: 240, y: 68 },
        { x: 300, y: 62 },
        { x: 360, y: 55 },
    ];

    const createPath = (points: { x: number; y: number }[]) => {
        return points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
            .join(" ");
    };

    return (
        <div className="flex h-full flex-col">
            {/* Title */}
            <h3 className="text-xl font-semibold text-[#2D3748]">{title}</h3>

            {/* Chart Area */}
            <div className="mt-4 flex-1">
                <svg viewBox="0 0 400 140" className="h-full w-full">
                    {/* Gradient for line 1 */}
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#34A4B3" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#34A4B3" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#40C9DB" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#40C9DB" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Area fills */}
                    <path
                        d={`${createPath(line1Points)} L 360 140 L 0 140 Z`}
                        fill="url(#gradient1)"
                    />
                    <path
                        d={`${createPath(line2Points)} L 360 140 L 0 140 Z`}
                        fill="url(#gradient2)"
                    />

                    {/* Lines */}
                    <path
                        d={createPath(line1Points)}
                        fill="none"
                        stroke="#34A4B3"
                        strokeWidth="2"
                    />
                    <path
                        d={createPath(line2Points)}
                        fill="none"
                        stroke="#40C9DB"
                        strokeWidth="2"
                    />

                    {/* Points */}
                    {line1Points.map((p, i) => (
                        <circle key={`p1-${i}`} cx={p.x} cy={p.y} r="4" fill="#34A4B3" />
                    ))}
                    {line2Points.map((p, i) => (
                        <circle key={`p2-${i}`} cx={p.x} cy={p.y} r="4" fill="#40C9DB" />
                    ))}
                </svg>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-4 rounded bg-donamed-primary" />
                        <span className="text-base text-[#5F6368]">Este mes</span>
                    </div>
                    <span className="text-sm font-medium text-[#2D3748]">3,004</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-4 rounded bg-donamed-secondary" />
                        <span className="text-base text-[#5F6368]">Mes anterior</span>
                    </div>
                    <span className="text-sm font-medium text-[#2D3748]">4,504</span>
                </div>
            </div>
        </div>
    );
}
