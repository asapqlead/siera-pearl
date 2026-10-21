"use client";

import React from "react";
import { X } from "lucide-react";
import { ProductCategory, PearlType, MetalType } from "@/types/product";
import { CatalogFilterState, getActiveFilterCount } from "@/lib/filter-utils";
import { formatMoney } from "@/lib/products";

export interface FilterChipsProps {
  filters: CatalogFilterState;
  onRemoveCategory: (cat: ProductCategory) => void;
  onRemovePearl: (pearl: PearlType) => void;
  onRemoveMetal: (metal: MetalType) => void;
  onClearPrice: () => void;
  onClearInStock: () => void;
  onClearSearch: () => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterChips({
  filters,
  onRemoveCategory,
  onRemovePearl,
  onRemoveMetal,
  onClearPrice,
  onClearInStock,
  onClearSearch,
  onClearAll,
  className = "",
}: FilterChipsProps) {
  const activeCount = getActiveFilterCount(filters);
  if (activeCount === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 py-3 ${className}`}>
      <span className="text-xs uppercase tracking-[0.08em] text-[var(--text-tertiary)] font-sans font-medium mr-1 select-none">
        Active Filters:
      </span>

      {/* Category Chips */}
      {filters.category.map((cat) => (
        <span
          key={cat}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[var(--surface-muted)] text-[var(--text)] text-xs font-sans font-normal border border-[var(--border)] transition-colors hover:border-[var(--brand)]"
        >
          <span>{cat}</span>
          <button
            type="button"
            onClick={() => onRemoveCategory(cat)}
            className="text-[var(--text-tertiary)] hover:text-[var(--error)] p-0.5 rounded-[2px] focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
            aria-label={`Remove filter ${cat}`}
          >
            <X className="w-3 h-3 stroke-[2]" />
          </button>
        </span>
      ))}

      {/* Pearl Chips */}
      {filters.pearl.map((pearl) => (
        <span
          key={pearl}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[var(--surface-muted)] text-[var(--text)] text-xs font-sans font-normal border border-[var(--border)] transition-colors hover:border-[var(--brand)]"
        >
          <span>{pearl} Pearl</span>
          <button
            type="button"
            onClick={() => onRemovePearl(pearl)}
            className="text-[var(--text-tertiary)] hover:text-[var(--error)] p-0.5 rounded-[2px] focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
            aria-label={`Remove filter ${pearl}`}
          >
            <X className="w-3 h-3 stroke-[2]" />
          </button>
        </span>
      ))}

      {/* Metal Chips */}
      {filters.metal.map((metal) => (
        <span
          key={metal}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[var(--surface-muted)] text-[var(--text)] text-xs font-sans font-normal border border-[var(--border)] transition-colors hover:border-[var(--brand)]"
        >
          <span>{metal}</span>
          <button
            type="button"
            onClick={() => onRemoveMetal(metal)}
            className="text-[var(--text-tertiary)] hover:text-[var(--error)] p-0.5 rounded-[2px] focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
            aria-label={`Remove filter ${metal}`}
          >
            <X className="w-3 h-3 stroke-[2]" />
          </button>
        </span>
      ))}

      {/* Price Range Chip */}
      {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[var(--surface-muted)] text-[var(--text)] text-xs font-sans font-normal border border-[var(--border)] transition-colors hover:border-[var(--brand)]">
          <span>
            {filters.minPrice !== undefined && filters.maxPrice !== undefined
              ? `${formatMoney(filters.minPrice)} – ${formatMoney(filters.maxPrice)}`
              : filters.minPrice !== undefined
              ? `From ${formatMoney(filters.minPrice)}`
              : `Up to ${formatMoney(filters.maxPrice!)}`}
          </span>
          <button
            type="button"
            onClick={onClearPrice}
            className="text-[var(--text-tertiary)] hover:text-[var(--error)] p-0.5 rounded-[2px] focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
            aria-label="Remove price filter"
          >
            <X className="w-3 h-3 stroke-[2]" />
          </button>
        </span>
      )}

      {/* In Stock Only Chip */}
      {filters.inStockOnly && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[var(--surface-muted)] text-[var(--text)] text-xs font-sans font-normal border border-[var(--border)] transition-colors hover:border-[var(--brand)]">
          <span>In Stock Only</span>
          <button
            type="button"
            onClick={onClearInStock}
            className="text-[var(--text-tertiary)] hover:text-[var(--error)] p-0.5 rounded-[2px] focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
            aria-label="Remove in-stock filter"
          >
            <X className="w-3 h-3 stroke-[2]" />
          </button>
        </span>
      )}

      {/* Search Query Chip */}
      {filters.search && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[var(--surface-muted)] text-[var(--text)] text-xs font-sans font-normal border border-[var(--border)] transition-colors hover:border-[var(--brand)]">
          <span>&ldquo;{filters.search}&rdquo;</span>
          <button
            type="button"
            onClick={onClearSearch}
            className="text-[var(--text-tertiary)] hover:text-[var(--error)] p-0.5 rounded-[2px] focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
            aria-label="Remove search filter"
          >
            <X className="w-3 h-3 stroke-[2]" />
          </button>
        </span>
      )}

      {/* Clear All Action */}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--brand)] underline underline-offset-4 font-normal ml-1 btn-press"
      >
        Clear all
      </button>
    </div>
  );
}
