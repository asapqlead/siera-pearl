"use client";

import React from "react";
import { Star } from "lucide-react";

export interface RatingProps {
  score: number;
  maxScore?: number;
  reviewCount?: number;
  size?: "sm" | "md";
  showLabel?: boolean;
  onReviewsClick?: () => void;
  className?: string;
}

export function Rating({
  score,
  maxScore = 5,
  reviewCount,
  size = "md",
  showLabel = true,
  onReviewsClick,
  className = "",
}: RatingProps) {
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
  };

  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      {/* Stars Row */}
      <div className="flex items-center gap-0.5 text-[var(--accent)]" aria-label={`Rating ${score} out of ${maxScore} stars`}>
        {Array.from({ length: maxScore }).map((_, idx) => {
          const filled = idx < Math.floor(score);
          const half = !filled && idx < score;

          return (
            <Star
              key={idx}
              className={`${iconSizes[size]} ${
                filled
                  ? "fill-current"
                  : half
                  ? "fill-current opacity-60"
                  : "text-[var(--border)] fill-none stroke-[1.5]"
              }`}
            />
          );
        })}
      </div>

      {/* Numerical score and optional review count */}
      {showLabel && (
        <span className="text-xs text-[var(--text-secondary)] font-sans">
          <span className="font-medium text-[var(--text)] tabular-nums">{score.toFixed(1)}</span>
          {typeof reviewCount === "number" && (
            <>
              <span className="mx-1 text-[var(--text-tertiary)]">·</span>
              {onReviewsClick ? (
                <button
                  type="button"
                  onClick={onReviewsClick}
                  className="hover:text-[var(--brand)] underline underline-offset-2 transition-colors cursor-pointer"
                >
                  {reviewCount} reviews
                </button>
              ) : (
                <span className="text-[var(--text-secondary)]">{reviewCount} reviews</span>
              )}
            </>
          )}
        </span>
      )}
    </div>
  );
}
