import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
    icon: LucideIcon;
    value: string | number;
    label: string;
    subLabel?: string;
    variant?: "primary" | "light";
}

export function StatsCard({
    icon: Icon,
    value,
    label,
    subLabel,
    variant = "light",
}: StatsCardProps) {
    const isPrimary = variant === "primary";

    return (
        <div
            className={cn(
                "flex h-full min-h-[160px] w-full min-w-0 flex-col rounded-2xl p-5 transition-colors sm:min-h-[184px]",
                isPrimary
                    ? "bg-donamed-secondary shadow-[0_18px_40px_rgba(64,201,219,0.22)] dark:bg-[linear-gradient(180deg,#31b8c9_0%,#2093a5_100%)] dark:shadow-[0_22px_42px_rgba(18,148,165,0.26)]"
                    : "bg-donamed-secondary/20 dark:border dark:border-cyan-400/10 dark:bg-[#122638]"
            )}
        >
            {/* Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#0f1a29] dark:ring-1 dark:ring-white/10">
                <Icon className="h-6 w-6 text-donamed-primary dark:text-[#89e5ef]" />
            </div>

            {/* Value */}
            <span
                className={cn(
                    "mt-4 text-2xl font-semibold",
                    isPrimary ? "font-bold text-white" : "text-[#404040] dark:text-slate-100"
                )}
            >
                {value}
            </span>

            {/* Label */}
            <span
                className={cn(
                    "text-sm font-medium sm:text-base",
                    isPrimary ? "font-semibold text-white/95" : "text-[#425166] dark:text-slate-300"
                )}
            >
                {label}
            </span>

            {/* Sub Label */}
            {subLabel && (
                <span
                    className={cn(
                        "mt-1 text-xs font-medium",
                        isPrimary ? "text-white/80" : "text-[#1C5961] dark:text-[#80dbe5]"
                    )}
                >
                    {subLabel}
                </span>
            )}
        </div>
    );
}
