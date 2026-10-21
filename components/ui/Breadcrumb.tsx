"use client";

import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-[var(--text-secondary)] font-sans ${className}`}>
      <ol className="flex items-center flex-wrap gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} className="flex items-center gap-2">
              {idx > 0 && (
                <span className="text-[var(--text-tertiary)] select-none" aria-hidden="true">
                  /
                </span>
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[var(--brand)] transition-colors underline-offset-2 hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-medium text-[var(--text)] select-none truncate max-w-[200px] sm:max-w-none"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
