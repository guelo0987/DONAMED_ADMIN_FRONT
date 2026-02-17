interface BarChartProps {
    title: string;
    legend1: string;
    legend2: string;
    legend1Value?: number;
    legend2Value?: number;
}

export function BarChart({
    title,
    legend1,
    legend2,
    legend1Value = 0,
    legend2Value = 0,
}: BarChartProps) {
    const maxValue = Math.max(legend1Value, legend2Value, 1);

    // Generate proportional bars from the two values
    const data = [
        { value1: legend1Value, value2: legend2Value },
        { value1: Math.round(legend1Value * 0.7), value2: Math.round(legend2Value * 0.6) },
        { value1: Math.round(legend1Value * 0.5), value2: Math.round(legend2Value * 0.4) },
        { value1: Math.round(legend1Value * 0.8), value2: Math.round(legend2Value * 0.9) },
        { value1: Math.round(legend1Value * 0.6), value2: Math.round(legend2Value * 0.7) },
        { value1: Math.round(legend1Value * 0.9), value2: Math.round(legend2Value * 0.5) },
    ];

    return (
        <div className="flex h-full flex-col">
            <h3 className="text-xl font-semibold text-[#404040]">{title}</h3>

            <div className="mt-6 flex flex-1 items-end justify-around gap-4">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                        <div className="flex items-end gap-1">
                            <div
                                className="w-3 rounded-sm bg-donamed-dark"
                                style={{
                                    height: `${Math.max((item.value1 / maxValue) * 120, 2)}px`,
                                }}
                            />
                            <div
                                className="w-3 rounded-sm bg-donamed-secondary"
                                style={{
                                    height: `${Math.max((item.value2 / maxValue) * 120, 2)}px`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="my-4 h-px w-full bg-[#EDF2F6]" />

            <div className="flex items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded bg-donamed-dark" />
                        <span className="text-base text-[#5B5B5B]">{legend1}</span>
                    </div>
                    <span className="text-sm font-medium text-[#222B45]">
                        {legend1Value.toLocaleString()}
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded bg-donamed-secondary" />
                        <span className="text-base text-[#5B5B5B]">{legend2}</span>
                    </div>
                    <span className="text-sm font-medium text-[#222B45]">
                        {legend2Value.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
