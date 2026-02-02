interface BarChartProps {
    title: string;
    data: { label: string; value1: number; value2: number }[];
    legend1: string;
    legend2: string;
    legend1Value?: number;
    legend2Value?: number;
}

export function BarChart({
    title,
    data,
    legend1,
    legend2,
    legend1Value,
    legend2Value,
}: BarChartProps) {
    const maxValue = Math.max(
        ...data.flatMap((d) => [d.value1, d.value2])
    );

    return (
        <div className="flex h-full flex-col">
            {/* Title */}
            <h3 className="text-xl font-semibold text-[#404040]">{title}</h3>

            {/* Chart Area */}
            <div className="mt-6 flex flex-1 items-end justify-around gap-4">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                        <div className="flex items-end gap-1">
                            {/* Bar 1 */}
                            <div
                                className="w-3 rounded-sm bg-donamed-dark"
                                style={{
                                    height: `${(item.value1 / maxValue) * 120}px`,
                                }}
                            />
                            {/* Bar 2 */}
                            <div
                                className="w-3 rounded-sm bg-donamed-secondary"
                                style={{
                                    height: `${(item.value2 / maxValue) * 120}px`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="my-4 h-px w-full bg-[#EDF2F6]" />

            {/* Legend */}
            <div className="flex items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded bg-donamed-dark" />
                        <span className="text-base text-[#5B5B5B]">{legend1}</span>
                    </div>
                    {legend1Value !== undefined && (
                        <span className="text-sm font-medium text-[#222B45]">
                            {legend1Value}
                        </span>
                    )}
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded bg-donamed-secondary" />
                        <span className="text-base text-[#5B5B5B]">{legend2}</span>
                    </div>
                    {legend2Value !== undefined && (
                        <span className="text-sm font-medium text-[#222B45]">
                            {legend2Value}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
