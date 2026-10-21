"use client";

import React, { useState, useId } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  subtitle?: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string | null;
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenId = null,
  allowMultiple = false,
  className = "",
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);
  const baseId = useId();

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`divide-y divide-[var(--border)] border-y border-[var(--border)] ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const headerId = `${baseId}-header-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div key={item.id} className="py-1">
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="w-full py-4 flex items-center justify-between text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                <div>
                  <span className="font-serif text-base sm:text-lg text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <p className="text-xs text-[var(--text-secondary)] font-sans font-light mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ease-out flex-shrink-0 ${
                    isOpen ? "rotate-180 text-[var(--brand)]" : ""
                  }`}
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={`grid transition-all duration-250 ease-out overflow-hidden ${
                isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed font-light">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
