"use client";

import React from "react";
import { MetalType } from "@/types/product";

export interface SwatchProps {
  metal: MetalType;
  selected?: boolean;
  onSelect?: (metal: MetalType) => void;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  disabled?: boolean;
  className?: string;
}

const METAL_SWATCH_COLORS: Record<MetalType, { bg: string; border: string }> = {
  "Yellow Gold": { bg: "#EBCB88", border: "#D4B36D" },
  "Rose Gold": { bg: "#E9BBA0", border: "#D09F81" },
  "White Gold": { bg: "#E2E2E2", border: "#C8C8C8" },
};

export function Swatch({
  metal,
  selected = false,
  onSelect,
  size = "md",
  showLabel = false,
  disabled = false,
  className = "",
}: SwatchProps) {
  const { bg, border } = METAL_SWATCH_COLORS[metal] || METAL_SWATCH_COLORS["Yellow Gold"];

  const sizeStyles = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onSelect) {
      onSelect(metal);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={`Select ${metal}`}
      aria-pressed={selected}
      title={metal}
      className={`inline-flex items-center gap-2 p-1.5 rounded-[3px] select-none btn-press relative before:absolute before:inset-[-6px] before:content-[''] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 transition-all ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <span
        style={{ backgroundColor: bg, borderColor: border }}
        className={`${sizeStyles[size]} rounded-full border shadow-2xs transition-all duration-150 ${
          selected ? "ring-2 ring-[var(--brand)] ring-offset-2" : "hover:scale-110"
        }`}
      />
      {showLabel && (
        <span
          className={`text-xs ${
            selected ? "font-semibold text-[var(--text)]" : "font-normal text-[var(--text-secondary)]"
          }`}
        >
          {metal}
        </span>
      )}
    </button>
  );
}
