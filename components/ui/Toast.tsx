"use client";

import React, { useEffect, useState } from "react";
import { Check, X, ArrowRight } from "lucide-react";

export interface ToastProps {
  id?: string;
  message: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  duration?: number;
  type?: "default" | "success" | "error";
}

export function Toast({
  message,
  description,
  actionLabel,
  onAction,
  onDismiss,
  duration = 3500,
  type: _type = "default",
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss?.(), 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[var(--text)] text-white p-4 rounded-[4px] shadow-xl border border-[var(--border)]/20 animate-toast-in flex items-start gap-3 select-none"
    >
      <div className="w-5 h-5 rounded-full bg-[var(--brand)] text-[var(--accent)] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <div className="text-xs font-semibold tracking-wide text-white">{message}</div>
        {description && (
          <p className="text-[11px] text-[var(--border)]/80 mt-0.5 leading-snug">
            {description}
          </p>
        )}

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:text-white font-medium mt-2 uppercase tracking-wider transition-colors btn-press cursor-pointer"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onDismiss?.(), 200);
        }}
        aria-label="Dismiss notification"
        className="p-1 -mr-1 text-[var(--border)]/60 hover:text-white rounded-[2px] transition-colors focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
