"use client";

import React, { forwardRef, InputHTMLAttributes, useId } from "react";
import { AlertCircle } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      id: customId,
      leftIcon,
      rightIcon,
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
    const hintId = `${id}-hint`;

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
          {leftIcon && (
            <span className="absolute left-3.5 text-[var(--text-tertiary)] pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={`w-full h-11 bg-white text-[var(--text)] text-sm rounded-[3px] border transition-colors duration-150 placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] ${
              leftIcon ? "pl-10" : "px-3.5"
            } ${rightIcon ? "pr-10" : "px-3.5"} ${
              error
                ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/30"
                : "border-[var(--border)] focus:border-[var(--accent)]"
            } ${
              disabled
                ? "bg-[var(--surface-muted)] text-[var(--text-tertiary)] cursor-not-allowed border-[var(--border-subtle)]"
                : "hover:border-[var(--text-secondary)]"
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3.5 text-[var(--text-tertiary)] flex items-center">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} className="text-xs text-[var(--error)] flex items-center gap-1.5 pt-0.5" role="alert">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="text-xs text-[var(--text-tertiary)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
