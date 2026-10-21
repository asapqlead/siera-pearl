"use client";

import React, { forwardRef, InputHTMLAttributes, useId } from "react";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
            type="radio"
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`w-4.5 h-4.5 rounded-full border transition-all duration-150 flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)] peer-focus-visible:ring-offset-2 ${
              checked
                ? "border-[var(--brand)] bg-white"
                : "bg-white border-[var(--border)] group-hover:border-[var(--text-secondary)]"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full bg-[var(--brand)] transition-transform duration-100 ${
                checked ? "scale-100 opacity-100" : "scale-0 opacity-0"
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

Radio.displayName = "Radio";
