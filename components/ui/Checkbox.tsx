"use client";

import React, { forwardRef, InputHTMLAttributes, useId } from "react";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, id: customId, className = "", checked, disabled, ...props }, ref) => {
    const generatedId = useId();
    const id = customId || generatedId;

    return (
      <label
        htmlFor={id}
        className={`inline-flex items-start gap-3 select-none text-left ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer group"
        } ${className}`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`w-4.5 h-4.5 rounded-[2px] border transition-all duration-150 flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)] peer-focus-visible:ring-offset-2 ${
              checked
                ? "bg-[var(--brand)] border-[var(--brand)] text-white"
                : "bg-white border-[var(--border)] group-hover:border-[var(--text-secondary)]"
            }`}
          >
            <Check
              className={`w-3.5 h-3.5 stroke-[2.5] transition-transform duration-100 ${
                checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            />
          </div>
        </div>

        {(label || description) && (
          <div className="text-xs leading-tight">
            {label && (
              <span className="font-medium text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                {label}
              </span>
            )}
            {description && (
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-normal">
                {description}
              </p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
