import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start justify-between rounded-lg border p-4 shadow-md transition-all animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === "success"
              ? "bg-green-50 border-green-200"
              : toast.type === "error"
              ? "bg-red-50 border-red-200"
              : toast.type === "warning"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="grid gap-1">
            {toast.title && <div className="text-sm font-medium">{toast.title}</div>}
            {toast.description && <div className="text-sm text-muted-foreground">{toast.description}</div>}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}