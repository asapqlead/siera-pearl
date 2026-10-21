"use client";

import React, { forwardRef, SelectHTMLAttributes, useId } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      hint,
      id: customId,
      className = "",
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const errorId = `${id}-error`;

    return (
      <div className="w-full flex flex-col space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={id}
            className="text-xs uppercase tracking-wider font-medium text-[var(--text)] flex items-center justify-between"
          >
            <span>
              {label} {required && <span className="text-[var(--error)]">*</span>}
            </span>
          </label>
        )}

        <div className="relative w-full flex items-center">
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            className={`w-full h-11 pl-3.5 pr-10 bg-white text-[var(--text)] text-sm rounded-[3px] border appearance-none transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent)] ${
              error
                ? "border-[var(--error)] focus:border-[var(--error)]"
                : "border-[var(--border)] focus:border-[var(--accent)]"
            } ${
              disabled
                ? "bg-[var(--surface-muted)] text-[var(--text-tertiary)] cursor-not-allowed border-[var(--border-subtle)]"
                : "hover:border-[var(--text-secondary)]"
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="w-4 h-4 text-[var(--text-secondary)] absolute right-3.5 pointer-events-none" />
        </div>

        {error && (
          <p id={errorId} className="text-xs text-[var(--error)] flex items-center gap-1.5 pt-0.5" role="alert">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {hint && !error && (
          <p className="text-xs text-[var(--text-tertiary)]">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
