"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { SortOption } from "@/types/product";
import { SORT_OPTIONS } from "@/lib/filter-utils";

export interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  className?: string;
}

export function SortDropdown({ value, onChange, className = "" }: SortDropdownProps) {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <label htmlFor="catalog-sort-select" className="sr-only">
        Sort Products
      </label>
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-[0.1em] text-[var(--text-tertiary)] font-sans font-medium select-none hidden sm:inline">
          Sort by:
        </span>
        <div className="relative">
          <select
            id="catalog-sort-select"
            value={value}
            onChange={(e) => onChange(e.target.value as SortOption)}
            className="appearance-none bg-white border border-[var(--border)] text-[var(--text)] text-xs font-sans font-normal py-2 pl-3 pr-8 rounded-[2px] cursor-pointer hover:border-[var(--brand)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-1 transition-colors"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
