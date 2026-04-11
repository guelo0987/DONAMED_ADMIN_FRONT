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
            <h3 className="text-xl font-semibold text-[#404040] dark:text-slate-100">{title}</h3>

            <div className="mt-6 flex flex-1 items-end justify-around gap-4 rounded-[20px] dark:border dark:border-white/6 dark:bg-white/[0.02] dark:px-4 dark:py-5">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                        <div className="flex items-end gap-1">
                            <div
                                className="w-3 rounded-sm bg-donamed-primary shadow-[0_12px_24px_rgba(52,164,179,0.18)] dark:bg-[#59d6e5] dark:shadow-[0_12px_24px_rgba(89,214,229,0.18)]"
                                style={{
                                    height: `${Math.max((item.value1 / maxValue) * 120, 2)}px`,
                                }}
                            />
                            <div
                                className="w-3 rounded-sm bg-donamed-secondary shadow-[0_12px_24px_rgba(64,201,219,0.18)] dark:bg-[#8ce9f3] dark:shadow-[0_12px_24px_rgba(140,233,243,0.18)]"
                                style={{
                                    height: `${Math.max((item.value2 / maxValue) * 120, 2)}px`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="my-4 h-px w-full bg-[#EDF2F6] dark:bg-white/10" />

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                <div className="flex flex-col items-center rounded-full bg-[#F8FAFC] px-4 py-2 dark:bg-[#102033]">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded bg-donamed-primary dark:bg-[#59d6e5]" />
                        <span className="text-sm text-[#5B5B5B] dark:text-slate-300 sm:text-base">{legend1}</span>
                    </div>
                    <span className="text-sm font-medium text-[#222B45] dark:text-slate-100">
                        {legend1Value.toLocaleString()}
                    </span>
                </div>
                <div className="flex flex-col items-center rounded-full bg-[#F8FAFC] px-4 py-2 dark:bg-[#102033]">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded bg-donamed-secondary dark:bg-[#8ce9f3]" />
                        <span className="text-sm text-[#5B5B5B] dark:text-slate-300 sm:text-base">{legend2}</span>
                    </div>
                    <span className="text-sm font-medium text-[#222B45] dark:text-slate-100">
                        {legend2Value.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
