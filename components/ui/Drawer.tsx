"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: "right" | "bottom";
  maxWidth?: string;
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  position = "right",
  maxWidth = "max-w-md",
  className = "",
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Focus trap & ESC handler
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

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

    // Set initial focus to the drawer container or close button
    const timer = setTimeout(() => {
      const closeBtn = drawerRef.current?.querySelector<HTMLElement>('[data-drawer-close]');
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

  const isBottom = position === "bottom";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 flex"
    >
      {/* Backdrop scrim with subtle blur */}
      <div
        className="fixed inset-0 bg-[#0B251D]/45 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`relative z-10 bg-white flex flex-col shadow-2xl transition-transform ${
          isBottom
            ? "mt-auto w-full max-h-[85vh] rounded-t-xl animate-popover-in border-t border-[var(--border)]"
            : `ml-auto w-full ${maxWidth} h-full animate-drawer-in border-l border-[var(--border)]`
        } ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[var(--border)] bg-[var(--bg)]/50">
          <div id="drawer-title" className="font-serif text-lg sm:text-xl font-medium text-[var(--text)]">
            {title}
          </div>
          <button
            type="button"
            data-drawer-close
            onClick={onClose}
            aria-label="Close drawer"
            className="p-2 -mr-2 text-[var(--text-secondary)] hover:text-[var(--text)] rounded-[3px] hover:bg-[var(--surface-muted)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-sm">{children}</div>

        {/* Optional Footer */}
        {footer && (
          <div className="p-5 sm:p-6 border-t border-[var(--border)] bg-[var(--bg)]/50">{footer}</div>
        )}
      </div>
    </div>
  );
}
