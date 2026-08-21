"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "~/lib/utils";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error";

type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  toast: (type: ToastType, message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function Toaster({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toast: (type, message) => {
          const id = ++toastId;
          setToasts((prev) => [...prev, { id, type, message }]);
          setTimeout(() => remove(id), 4000);
        }
      }}
    >
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-100 flex w-72 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-2.5 rounded-xl border bg-card p-3 shadow-xl shadow-black/20 animate-in fade-in slide-in-from-top-2",
              t.type === "success"
                ? "border-emerald-500/40"
                : "border-destructive/40"
            )}
          >
            {t.type === "success" ? (
              <CheckCircle2
                size={16}
                className="mt-0.5 shrink-0 text-emerald-500"
              />
            ) : (
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0 text-destructive"
              />
            )}
            <p className="flex-1 text-xs leading-relaxed text-foreground">
              {t.message}
            </p>
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within Toaster");
  return ctx;
}

// Helper to pull readable message out of an axios error
export function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null) {
    const e = err as { response?: { data?: { message?: string | string[] } } };
    const msg = e.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string" && msg) return msg;
  }
  return fallback;
}
