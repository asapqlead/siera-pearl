"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from "react";
import Image from "next/image";
import { Check, X, ArrowRight } from "lucide-react";

export interface ToastOptions {
  message: string;
  description?: string;
  thumbnail?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastContextType {
  showToast: (messageOrOptions: string | ToastOptions) => void;
  dismissToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dismissToast = useCallback(() => {
    setIsVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimeout(() => {
      setToast(null);
    }, 240);
  }, []);

  const showToast = useCallback((messageOrOptions: string | ToastOptions) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const options: ToastOptions =
      typeof messageOrOptions === "string"
        ? { message: messageOrOptions }
        : messageOrOptions;

    setToast(options);
    setIsVisible(true);

    const duration = options.duration || 4000;
    timerRef.current = setTimeout(() => {
      dismissToast();
    }, duration);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {isVisible && toast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-[#1E2420]/95 backdrop-blur-md text-[#FBFAF6] p-4 rounded-xl shadow-2xl border border-[#B78A45]/40 animate-toast-in flex items-start gap-3.5 transition-all duration-200"
          onMouseEnter={() => {
            if (timerRef.current) clearTimeout(timerRef.current);
          }}
          onMouseLeave={() => {
            timerRef.current = setTimeout(dismissToast, 2500);
          }}
        >
          {toast.thumbnail ? (
            <div className="relative w-12 h-12 rounded-lg bg-[#F4F1E8] border border-[#E4E0D3] overflow-hidden flex-shrink-0">
              <Image
                src={toast.thumbnail}
                alt={toast.message}
                fill
                sizes="48px"
                className="object-contain p-1"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#172A20] border border-[var(--border)] flex items-center justify-center flex-shrink-0 text-[var(--accent)] mt-0.5">
              <Check className="w-4 h-4 stroke-[2]" />
            </div>
          )}

          <div className="flex-1 min-w-0 pr-1">
            <h5 className="font-serif text-sm font-medium text-[#FBFAF6] leading-tight truncate">
              {toast.message}
            </h5>
            {toast.description && (
              <p className="text-xs text-[#B9C7BC] mt-0.5 leading-snug line-clamp-2 font-light">
                {toast.description}
              </p>
            )}

            {toast.actionLabel && toast.onAction && (
              <button
                onClick={() => {
                  toast.onAction?.();
                  dismissToast();
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#D9B677] hover:text-white font-semibold mt-2 group uppercase tracking-wider transition-colors btn-press"
              >
                <span>{toast.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            )}
          </div>

          <button
            onClick={dismissToast}
            className="p-1 rounded-md text-[#B9C7BC] hover:text-white hover:bg-white/10 transition-colors -mr-1 -mt-1"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
