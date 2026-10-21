"use client";

import React from "react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`py-16 sm:py-20 px-6 text-center border border-dashed border-[var(--border)] rounded-[4px] bg-[var(--surface-muted)]/40 flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-full bg-white border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)]">
          {icon}
        </div>
      )}

      <div className="space-y-1.5">
        <h3 className="font-serif text-xl sm:text-2xl text-[var(--text)] font-medium">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans max-w-sm mx-auto font-light leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
