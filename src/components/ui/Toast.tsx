import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import type { Toast as ToastType } from "@/contexts/ToastContext";

const variantStyles = {
    success: {
        container:
            "border-success/30 bg-success-light shadow-[0_4px_20px_rgba(5,197,41,0.15)]",
        icon: "text-success",
        Icon: CheckCircle2,
    },
    error: {
        container:
            "border-danger/30 bg-danger-light shadow-[0_4px_20px_rgba(197,5,5,0.12)]",
        icon: "text-danger",
        Icon: XCircle,
    },
    info: {
        container:
            "border-donamed-primary/40 bg-donamed-light/80 shadow-[0_4px_20px_rgba(52,164,179,0.18)]",
        icon: "text-donamed-dark",
        Icon: Info,
    },
};

interface ToastProps extends ToastType {
    onClose: () => void;
}

export function Toast({ id: _id, variant, message, title, onClose }: ToastProps) {
    const styles = variantStyles[variant];
    const Icon = styles.Icon;

    return (
        <div
            role="alert"
            className={`
                flex min-w-[320px] max-w-[420px] items-start gap-3 rounded-xl border-2 p-4
                animate-toast-in
                ${styles.container}
            `}
        >
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 ${styles.icon}`}
            >
                <Icon className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
                {title && (
                    <p className="text-sm font-semibold text-[#1E1E1E]">
                        {title}
                    </p>
                )}
                <p className="text-sm text-[#404040]">{message}</p>
            </div>
            <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="shrink-0 rounded-lg p-1.5 text-[#5B5B5B]/70 transition hover:bg-black/5 hover:text-[#1E1E1E]"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
