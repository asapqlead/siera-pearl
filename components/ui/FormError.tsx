"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className = "" }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex items-center gap-2 p-3 bg-[var(--error-bg)] border border-[var(--error)]/30 rounded-[3px] text-xs text-[var(--error)] animate-toast-in ${className}`}
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
