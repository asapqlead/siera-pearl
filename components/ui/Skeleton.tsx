"use client";

import React from "react";

export interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "text" | "card";
  aspectRatio?: string;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  aspectRatio,
}: SkeletonProps) {
  const baseClasses = "bg-[var(--surface-muted)] animate-pulse rounded-[2px]";

  if (variant === "card") {
    return (
      <div className={`flex flex-col space-y-3 ${className}`}>
        {/* 4:5 Aspect Ratio Product Image Placeholder */}
        <div className="relative aspect-[4/5] w-full bg-[var(--surface-muted)] animate-pulse rounded-[2px]" />
        {/* Title placeholder */}
        <div className="h-4 w-3/4 bg-[var(--surface-muted)] animate-pulse rounded-[2px]" />
        {/* Subtitle / Price placeholder */}
        <div className="h-3.5 w-1/3 bg-[var(--surface-muted)] animate-pulse rounded-[2px]" />
      </div>
    );
  }

  if (variant === "text") {
    return <div className={`h-4 w-full ${baseClasses} ${className}`} />;
  }

  return (
    <div
      style={aspectRatio ? { aspectRatio } : undefined}
      className={`${baseClasses} ${className}`}
    />
  );
}
