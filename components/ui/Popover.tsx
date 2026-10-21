"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Popover({
  trigger,
  children,
  align = "left",
  isOpen: controlledIsOpen,
  onOpenChange,
  className = "",
}: PopoverProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : internalIsOpen;

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) setInternalIsOpen(newOpen);
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  const alignmentClasses = {
    left: "left-0 origin-top-left",
    right: "right-0 origin-top-right",
    center: "left-1/2 -translate-x-1/2 origin-top",
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className={`absolute top-full mt-2 z-40 bg-white rounded-[4px] border border-[var(--border)] shadow-lg p-4 animate-popover-in ${
            alignmentClasses[align]
          } ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
