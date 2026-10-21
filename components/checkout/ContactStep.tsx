"use client";

import React, { useState } from "react";
import { Check, Mail, Phone } from "lucide-react";
import { ContactInfo } from "@/types/checkout";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";

export interface ContactStepProps {
  isActive: boolean;
  isCompleted: boolean;
  data: ContactInfo;
  onChange: (data: ContactInfo) => void;
  onContinue: () => void;
  onEdit: () => void;
}

export function ContactStep({
  isActive,
  isCompleted,
  data,
  onChange,
  onContinue,
  onEdit,
}: ContactStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!data.email.trim()) {
      errs.email = "Email is required for order confirmation";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errs.email = "Please enter a valid email address";
    }

    const cleanPhone = data.phone.replace(/\D/g, "");
    if (!data.phone.trim()) {
      errs.phone = "Phone number is required for courier dispatch";
    } else if (cleanPhone.length < 10) {
      errs.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onContinue();
    }
  };

  // Completed Collapsed View
  if (!isActive && isCompleted) {
    return (
      <div className="py-4 border-b border-[var(--border)] flex items-start justify-between select-none">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[var(--brand)] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check className="w-3 h-3 stroke-[2.5]" />
          </div>
          <div>
            <div className="font-serif text-base text-[var(--text)] font-normal">
              1. Contact Information
            </div>
            <div className="text-xs font-sans text-[var(--text-secondary)] mt-0.5 font-light">
              {data.email} · {data.phone}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--brand)] underline underline-offset-2 cursor-pointer"
        >
          Edit
        </button>
      </div>
    );
  }

  // Active Expanded Form
  if (isActive) {
    return (
      <form onSubmit={handleSubmit} className="py-6 border-b border-[var(--border)] space-y-5">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[var(--text)] font-normal tracking-tight">
            1. Contact Information
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-light mt-1">
            We will send your order confirmation, appraisal certificate, and insured courier tracking here.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="collector@example.com"
            value={data.email}
            onChange={(e) => {
              onChange({ ...data, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            onBlur={validate}
            error={errors.email}
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Mobile Phone (for white-glove courier dispatch)"
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="(555) 000-0000"
            value={data.phone}
            onChange={(e) => {
              onChange({ ...data, phone: e.target.value });
              if (errors.phone) setErrors({ ...errors, phone: "" });
            }}
            onBlur={validate}
            error={errors.phone}
            hint="Required by courier for delivery signature coordination."
            required
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <Checkbox
            checked={data.newsletterOptIn}
            onChange={(e) => onChange({ ...data, newsletterOptIn: (e.target as HTMLInputElement).checked })}
            label="Receive private salon previews & lagoon harvest releases (Max 2/mo)"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full sm:w-auto h-11 px-8 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-sans font-medium uppercase tracking-[0.14em] rounded-[2px] transition-colors btn-press shadow-xs cursor-pointer"
          >
            Continue to Delivery
          </button>
        </div>
      </form>
    );
  }

  // Inactive Ahead View
  return (
    <div className="py-4 border-b border-[var(--border)] opacity-50 flex items-center gap-3 select-none">
      <div className="w-5 h-5 rounded-full border border-[var(--text-tertiary)] text-[var(--text-tertiary)] text-xs font-sans flex items-center justify-center">
        1
      </div>
      <div className="font-serif text-base text-[var(--text-secondary)]">
        1. Contact Information
      </div>
    </div>
  );
}
