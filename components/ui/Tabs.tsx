"use client";

import React, { useRef } from "react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className = "" }: TabsProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledTabs = items.filter((item) => !item.disabled);
    const currentIndex = enabledTabs.findIndex((item) => item.id === items[index].id);

    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % enabledTabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = enabledTabs.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = enabledTabs[nextIndex];
      onChange(nextTab.id);
      const button = tabListRef.current?.querySelector<HTMLButtonElement>(
        `[data-tab-id="${nextTab.id}"]`
      );
      button?.focus();
    }
  };

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-orientation="horizontal"
      className={`flex items-center gap-6 sm:gap-8 border-b border-[var(--border)] overflow-x-auto scrollbar-none ${className}`}
    >
      {items.map((tab, idx) => {
        const isActive = tab.id === activeId;

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            data-tab-id={tab.id}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`relative py-3.5 text-xs uppercase tracking-wider font-medium select-none whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ${
              tab.disabled
                ? "opacity-40 cursor-not-allowed"
                : isActive
                ? "text-[var(--brand)] font-semibold"
                : "text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                    isActive
                      ? "bg-[var(--brand-muted)] text-[var(--brand)] font-semibold"
                      : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>

            {/* Hairline Underline Indicator */}
            {isActive && (
              <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[var(--brand)] rounded-t-[1px]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
