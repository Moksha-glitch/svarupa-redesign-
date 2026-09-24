"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Toast = { id: number; message: string };

const ToastContext = createContext<{
  toast: (message: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((current) => [...current.slice(-2), { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 2400);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[5.5rem] z-50 flex flex-col items-center gap-2 px-4 lg:bottom-8"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <p
            key={item.id}
            className={cn(
              "animate-fade-up rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink shadow-sm",
            )}
          >
            {item.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx ?? { toast: () => undefined };
}
