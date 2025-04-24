import { createContext, useState, useCallback, useContext, ReactNode, useEffect } from "react";

export type ToastProps = {
  title?: string;
  description?: string;
  type?: "default" | "success" | "error" | "warning";
  duration?: number;
};

export type Toast = ToastProps & {
  id: string;
};

type ToastContextType = {
  toasts: Toast[];
  toast: (toast: ToastProps) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, type = "default", duration = 5000 }: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, title, description, type, duration };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Automatically dismiss the oldest toast based on its duration.
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, toasts[0].duration);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  return <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>;
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
