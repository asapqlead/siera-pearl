"use client";

import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "text";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseClasses =
      "inline-flex items-center justify-center font-sans font-medium transition-all duration-150 select-none btn-press focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2";

    // Radius: 3px (per luxury spec: 2-4px, never rounded-full for buttons)
    const radiusClasses = "rounded-[3px]";

    // Variant Styles
    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] border border-transparent shadow-xs active:bg-[#0E2C22]",
      secondary:
        "bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-muted)] hover:border-[var(--text)] active:bg-[#EBE6DC]",
      outline:
        "bg-transparent text-[var(--brand)] border border-[var(--brand)] hover:bg-[var(--brand-muted)] active:bg-[#DCE7DD]",
      text:
        "bg-transparent text-[var(--text)] hover:text-[var(--brand)] p-0 h-auto underline-offset-4 hover:underline active:opacity-70 border-none shadow-none",
    };

    // Size Styles (ensuring minimum 44px touch target on mobile where appropriate)
    const sizeClasses: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-xs tracking-wider uppercase",
      md: "h-11 px-5 text-xs sm:text-[13px] tracking-wider uppercase",
      lg: "h-13 px-7 text-sm tracking-widest uppercase font-semibold",
    };

    // Disabled & Loading
    const stateClasses =
      disabled || isLoading
        ? "opacity-45 cursor-not-allowed pointer-events-none"
        : "cursor-pointer";

    const isTextVariant = variant === "text";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${baseClasses} ${radiusClasses} ${variantClasses[variant]} ${
          isTextVariant ? "" : sizeClasses[size]
        } ${stateClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
            <span>Processing</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
