"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "md",
  className = "",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector<HTMLElement>('[data-modal-close]');
      closeBtn?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      clearTimeout(timer);
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Scrim backdrop */}
      <div
        className="fixed inset-0 bg-[#0B251D]/55 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className={`relative z-10 w-full ${maxWidthClasses[maxWidth]} bg-white rounded-[4px] border border-[var(--border)] shadow-xl animate-popover-in overflow-hidden flex flex-col ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[var(--border)] bg-[var(--bg)]/40">
          <div id="modal-title" className="font-serif text-xl font-medium text-[var(--text)]">
            {title}
          </div>
          <button
            type="button"
            data-modal-close
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 -mr-1 text-[var(--text-secondary)] hover:text-[var(--text)] rounded-[3px] hover:bg-[var(--surface-muted)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[75vh] text-sm text-[var(--text)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 sm:p-5 border-t border-[var(--border)] bg-[var(--bg)]/40 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
