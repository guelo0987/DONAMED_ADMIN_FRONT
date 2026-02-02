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
                "flex h-[184px] w-[180px] flex-col rounded-2xl p-5",
                isPrimary ? "bg-donamed-secondary" : "bg-donamed-secondary/20"
            )}
        >
            {/* Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Icon className="h-6 w-6 text-donamed-primary" />
            </div>

            {/* Value */}
            <span
                className={cn(
                    "mt-4 text-2xl font-semibold",
                    isPrimary ? "font-bold text-white" : "text-[#404040]"
                )}
            >
                {value}
            </span>

            {/* Label */}
            <span
                className={cn(
                    "text-base font-medium",
                    isPrimary ? "font-semibold text-white" : "text-[#425166]"
                )}
            >
                {label}
            </span>

            {/* Sub Label */}
            {subLabel && (
                <span
                    className={cn(
                        "mt-1 text-xs font-medium",
                        isPrimary ? "text-white" : "text-[#1C5961]"
                    )}
                >
                    {subLabel}
                </span>
            )}
        </div>
    );
}
