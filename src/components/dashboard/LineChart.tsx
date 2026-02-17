interface LineChartProps {
    title: string;
    esteMes?: number;
    mesAnterior?: number;
}

export function LineChart({ title, esteMes = 0, mesAnterior = 0 }: LineChartProps) {
    const maxVal = Math.max(esteMes, mesAnterior, 1);

    // Simulated path based on actual values
    const h = 140;
    const w = 360;

    const esteMesY = h - (esteMes / maxVal) * (h - 20);
    const mesAnteriorY = h - (mesAnterior / maxVal) * (h - 20);

    const line1Points = [
        { x: 0, y: mesAnteriorY },
        { x: w * 0.17, y: mesAnteriorY + 5 },
        { x: w * 0.33, y: mesAnteriorY - 3 },
        { x: w * 0.5, y: (mesAnteriorY + esteMesY) / 2 },
        { x: w * 0.67, y: esteMesY + 8 },
        { x: w * 0.83, y: esteMesY - 2 },
        { x: w, y: esteMesY },
    ];

    const line2Points = [
        { x: 0, y: esteMesY + 15 },
        { x: w * 0.17, y: esteMesY + 10 },
        { x: w * 0.33, y: esteMesY + 18 },
        { x: w * 0.5, y: mesAnteriorY },
        { x: w * 0.67, y: mesAnteriorY - 5 },
        { x: w * 0.83, y: mesAnteriorY + 3 },
        { x: w, y: mesAnteriorY },
    ];

    const createPath = (points: { x: number; y: number }[]) => {
        return points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
            .join(" ");
    };

    return (
        <div className="flex h-full flex-col">
            <h3 className="text-xl font-semibold text-[#2D3748]">{title}</h3>

            <div className="mt-4 flex-1">
                <svg viewBox={`0 0 ${w + 40} ${h}`} className="h-full w-full">
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

                    <path
                        d={`${createPath(line1Points)} L ${w} ${h} L 0 ${h} Z`}
                        fill="url(#gradient1)"
                    />
                    <path
                        d={`${createPath(line2Points)} L ${w} ${h} L 0 ${h} Z`}
                        fill="url(#gradient2)"
                    />

                    <path d={createPath(line1Points)} fill="none" stroke="#34A4B3" strokeWidth="2" />
                    <path d={createPath(line2Points)} fill="none" stroke="#40C9DB" strokeWidth="2" />

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
                    <span className="text-sm font-medium text-[#2D3748]">
                        {esteMes.toLocaleString()}
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-4 rounded bg-donamed-secondary" />
                        <span className="text-base text-[#5F6368]">Mes anterior</span>
                    </div>
                    <span className="text-sm font-medium text-[#2D3748]">
                        {mesAnterior.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
