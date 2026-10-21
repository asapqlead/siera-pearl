"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  disabled = false,
  size = "md",
  className = "",
}: QuantityStepperProps) {
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value < max && !disabled) {
      onChange(value + 1);
    }
  };

  const isMin = value <= min;
  const isMax = value >= max;

  const containerSizes = {
    sm: "h-8 px-1 text-xs",
    md: "h-11 px-2 text-sm",
  };

  const buttonSizes = {
    sm: "w-6 h-6 p-1",
    md: "w-8 h-8 p-1.5",
  };

  return (
    <div
      className={`inline-flex items-center justify-between border border-[var(--border)] bg-white rounded-[3px] select-none ${
        containerSizes[size]
      } ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isMin || disabled}
        aria-label="Decrease quantity"
        className={`${buttonSizes[size]} relative before:absolute before:inset-[-6px] before:content-[''] flex items-center justify-center text-[var(--text)] hover:text-[var(--brand)] disabled:opacity-30 disabled:cursor-not-allowed btn-press rounded-[2px] focus-visible:outline-2 focus-visible:outline-[var(--accent)]`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span
        aria-live="polite"
        className="min-w-8 text-center font-sans tabular-nums font-medium text-[var(--text)]"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={isMax || disabled}
        aria-label="Increase quantity"
        className={`${buttonSizes[size]} relative before:absolute before:inset-[-6px] before:content-[''] flex items-center justify-center text-[var(--text)] hover:text-[var(--brand)] disabled:opacity-30 disabled:cursor-not-allowed btn-press rounded-[2px] focus-visible:outline-2 focus-visible:outline-[var(--accent)]`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
