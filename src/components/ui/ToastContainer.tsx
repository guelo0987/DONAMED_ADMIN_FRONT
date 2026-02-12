import { useToast } from "@/contexts/ToastContext";
import { Toast } from "./Toast";

export function ToastContainer() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed right-4 top-4 z-[9999] flex flex-col gap-3"
            aria-live="polite"
        >
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}
