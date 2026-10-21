"use client";

import React from "react";
import { formatMoney } from "@/lib/products";

export interface PriceProps {
  price: number;
  was?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Price({ price, was, size = "md", className = "" }: PriceProps) {
  const isSale = Boolean(was && was > price);

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-xl sm:text-2xl",
  };

  return (
    <div className={`inline-flex items-baseline gap-2 font-sans tabular-nums select-none ${className}`}>
      {isSale && was && (
        <span
          className={`line-through text-[var(--text-tertiary)] font-light ${
            size === "lg" ? "text-base sm:text-lg" : "text-xs"
          }`}
          aria-label={`Original price ${formatMoney(was)}`}
        >
          {formatMoney(was)}
        </span>
      )}

      <span
        className={`font-normal text-[var(--text)] ${sizeClasses[size]}`}
        aria-label={`Current price ${formatMoney(price)}`}
      >
        {formatMoney(price)}
      </span>
    </div>
  );
}
