"use client";

import React, { useEffect } from "react";
import { X, Check } from "lucide-react";
import { ProductCategory, PearlType, MetalType, Product } from "@/types/product";
import {
  CatalogFilterState,
  ALL_CATEGORIES,
  ALL_PEARL_TYPES,
  ALL_METALS,
  PRICE_RANGES,
} from "@/lib/filter-utils";
import { Checkbox } from "@/components/ui/Checkbox";

export interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CatalogFilterState;
  onFilterChange: (filters: CatalogFilterState) => void;
  products: Product[];
  totalResults: number;
}

export function MobileFilterSheet({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  products,
  totalResults,
}: MobileFilterSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleCategory = (cat: ProductCategory) => {
    const next = filters.category.includes(cat)
      ? filters.category.filter((c) => c !== cat)
      : [...filters.category, cat];
    onFilterChange({ ...filters, category: next });
  };

  const togglePearl = (pearl: PearlType) => {
    const next = filters.pearl.includes(pearl)
      ? filters.pearl.filter((p) => p !== pearl)
      : [...filters.pearl, pearl];
    onFilterChange({ ...filters, pearl: next });
  };

  const toggleMetal = (metal: MetalType) => {
    const next = filters.metal.includes(metal)
      ? filters.metal.filter((m) => m !== metal)
      : [...filters.metal, metal];
    onFilterChange({ ...filters, metal: next });
  };

  const selectPrice = (min?: number, max?: number) => {
    if (filters.minPrice === min && filters.maxPrice === max) {
      onFilterChange({ ...filters, minPrice: undefined, maxPrice: undefined });
    } else {
      onFilterChange({ ...filters, minPrice: min, maxPrice: max });
    }
  };

  const handleClearAll = () => {
    onFilterChange({
      ...filters,
      category: [],
      pearl: [],
      metal: [],
      minPrice: undefined,
      maxPrice: undefined,
      inStockOnly: false,
      search: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-drawer-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <h3 className="font-serif text-lg font-normal text-[var(--text)]">
            Filter Fine Jewelry
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text)] rounded-[2px] transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Availability Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
            <span className="text-xs uppercase tracking-wider font-sans font-medium text-[var(--text)]">
              In Stock Only
            </span>
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
              className="w-4 h-4 accent-[var(--brand)] rounded cursor-pointer"
            />
          </div>

          {/* Categories */}
          <div className="space-y-3 pb-4 border-b border-[var(--border)]">
            <h4 className="text-xs uppercase tracking-wider font-sans font-medium text-[var(--text-tertiary)]">
              Category
            </h4>
            <div className="space-y-2">
              {ALL_CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center justify-between text-sm text-[var(--text)] cursor-pointer py-1 select-none"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={filters.category.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <span>{cat}</span>
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)] font-sans">
                    ({products.filter((p) => p.cat === cat).length})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Pearl Variety */}
          <div className="space-y-3 pb-4 border-b border-[var(--border)]">
            <h4 className="text-xs uppercase tracking-wider font-sans font-medium text-[var(--text-tertiary)]">
              Pearl Variety
            </h4>
            <div className="space-y-2">
              {ALL_PEARL_TYPES.map((pearl) => (
                <label
                  key={pearl}
                  className="flex items-center justify-between text-sm text-[var(--text)] cursor-pointer py-1 select-none"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={filters.pearl.includes(pearl)}
                      onChange={() => togglePearl(pearl)}
                    />
                    <span>{pearl} Pearl</span>
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)] font-sans">
                    ({products.filter((p) => p.pearl === pearl).length})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Precious Metal Alloy */}
          <div className="space-y-3 pb-4 border-b border-[var(--border)]">
            <h4 className="text-xs uppercase tracking-wider font-sans font-medium text-[var(--text-tertiary)]">
              Precious Metal Alloy
            </h4>
            <div className="space-y-2">
              {ALL_METALS.map((metal) => (
                <label
                  key={metal}
                  className="flex items-center gap-3 text-sm text-[var(--text)] cursor-pointer py-1 select-none"
                >
                  <Checkbox
                    checked={filters.metal.includes(metal)}
                    onChange={() => toggleMetal(metal)}
                  />
                  <span>{metal}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 pb-4">
            <h4 className="text-xs uppercase tracking-wider font-sans font-medium text-[var(--text-tertiary)]">
              Price Range
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {PRICE_RANGES.map((r) => {
                const isSelected = filters.minPrice === r.min && filters.maxPrice === r.max;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => selectPrice(r.min, r.max)}
                    className={`py-2 px-3 text-xs rounded-[2px] border text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? "border-[var(--brand)] bg-[var(--brand-muted)] text-[var(--brand)] font-semibold"
                        : "border-[var(--border)] text-[var(--text)] hover:border-[var(--brand)] bg-white"
                    }`}
                  >
                    <span>{r.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-[var(--brand)]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-white flex items-center gap-3">
          <button
            type="button"
            onClick={handleClearAll}
            className="py-3 px-4 rounded-[2px] text-xs font-sans uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text)] underline underline-offset-4 btn-press"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white rounded-[2px] text-xs font-sans font-medium uppercase tracking-[0.14em] shadow-sm transition-colors btn-press text-center"
          >
            Show {totalResults} {totalResults === 1 ? "Piece" : "Pieces"}
          </button>
        </div>
      </div>
    </div>
  );
}
