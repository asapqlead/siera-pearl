"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem("siera_pearl_announcement_dismissed");
      if (dismissed === "true") {
        setIsVisible(false);
      }
    } catch {
      // Ignore storage errors in private browsing
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem("siera_pearl_announcement_dismissed", "true");
    } catch {
      // Ignore storage errors
    }
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="h-9 bg-[var(--brand)] text-[var(--bg)] flex items-center justify-between px-4 sm:px-8 text-[11px] sm:text-xs tracking-wider uppercase font-medium border-b border-[var(--brand-hover)] select-none z-40 relative"
    >
      <div className="flex-1 text-center truncate pr-6 sm:pr-0">
        <span>Free insured shipping and 30-day returns on every order</span>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="p-1 -mr-1 text-[var(--bg)]/70 hover:text-white transition-colors rounded-[2px] focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
