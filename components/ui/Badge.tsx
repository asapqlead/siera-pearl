"use client";

import React from "react";

export type BadgeType = "New" | "Bestseller" | "Low stock" | "Sold out" | "Sale";
export type BadgeVariant = "label" | "chip";

export interface BadgeProps {
  type: BadgeType;
  variant?: BadgeVariant;
  customText?: string;
  className?: string;
}

export function Badge({
  type,
  variant = "label",
  customText,
  className = "",
}: BadgeProps) {
  const displayText = customText || type;

  // Variant 1: Pure quiet text label (ideal for luxury product cards per spec)
  if (variant === "label") {
    const textColors: Record<BadgeType, string> = {
      New: "text-[var(--brand)]",
      Bestseller: "text-[var(--accent)]",
      "Low stock": "text-[var(--warning)]",
      "Sold out": "text-[var(--text-tertiary)]",
      Sale: "text-[var(--error)]",
    };

    return (
      <span
        className={`text-[11px] font-sans uppercase tracking-[0.08em] font-semibold select-none ${
          textColors[type] || "text-[var(--text-secondary)]"
        } ${className}`}
      >
        {displayText}
      </span>
    );
  }

  // Variant 2: Small status chip (pill shape per spec: "Pill shape ONLY for small status tags/chips")
  const chipStyles: Record<BadgeType, string> = {
    New: "bg-[var(--brand-muted)] text-[var(--brand)] border-[var(--brand)]/20",
    Bestseller: "bg-[var(--accent-muted)] text-[#8C6A2F] border-[#8C6A2F]/25",
    "Low stock": "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20",
    "Sold out": "bg-[var(--surface-muted)] text-[var(--text-tertiary)] border-[var(--border)]",
    Sale: "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error)]/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider font-semibold border select-none ${
        chipStyles[type] || "bg-[var(--surface-muted)] text-[var(--text)] border-[var(--border)]"
      } ${className}`}
    >
      {displayText}
    </span>
  );
}
