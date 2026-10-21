"use client";

import React, { useState } from "react";
import { Check, CreditCard, Lock } from "lucide-react";
import { PaymentInfo } from "@/types/checkout";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";

export interface PaymentStepProps {
  isActive: boolean;
  isCompleted: boolean;
  data: PaymentInfo;
  onChange: (data: PaymentInfo) => void;
  onContinue: () => void;
  onEdit: () => void;
}

export function PaymentStep({
  isActive,
  isCompleted,
  data,
  onChange,
  onContinue,
  onEdit,
}: PaymentStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Detect card brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, "");
    if (/^4/.test(clean)) return "Visa";
    if (/^5[1-5]/.test(clean)) return "Mastercard";
    if (/^3[47]/.test(clean)) return "Amex";
    return "";
  };

  const handleCardNumberChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    const parts = digits.match(/.{1,4}/g);
    const formatted = parts ? parts.join(" ") : digits;
    onChange({ ...data, cardNumber: formatted });
    if (errors.cardNumber) setErrors({ ...errors, cardNumber: "" });
  };

  const handleExpiryChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    let formatted = digits;
    if (digits.length >= 3) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    onChange({ ...data, expiry: formatted });
    if (errors.expiry) setErrors({ ...errors, expiry: "" });
  };

  const validate = () => {
    if (data.method !== "card") return true;

    const errs: Record<string, string> = {};
    if (!data.cardholderName.trim()) {
      errs.cardholderName = "Cardholder name is required";
    }

    const cleanNum = data.cardNumber.replace(/\s/g, "");
    if (cleanNum.length !== 16) {
      errs.cardNumber = "Valid 16-digit card number is required";
    }

    if (!/^\d{2}\/\d{2}$/.test(data.expiry)) {
      errs.expiry = "Valid MM/YY expiry required";
    }

    const cleanCvc = data.cvc.replace(/\D/g, "");
    if (cleanCvc.length < 3 || cleanCvc.length > 4) {
      errs.cvc = "Valid 3 or 4 digit security code required";
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
    const last4 = data.cardNumber.replace(/\s/g, "").slice(-4) || "4242";
    const brand = getCardBrand(data.cardNumber) || "Credit Card";
    return (
      <div className="py-4 border-b border-[var(--border)] flex items-start justify-between select-none">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[var(--brand)] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check className="w-3 h-3 stroke-[2.5]" />
          </div>
          <div>
            <div className="font-serif text-base text-[var(--text)] font-normal">
              3. Payment Authorization
            </div>
            <div className="text-xs font-sans text-[var(--text-secondary)] mt-0.5 font-light">
              {data.method === "card"
                ? `${brand} ending in •••• ${last4}`
                : data.method === "apple_pay"
                ? "Apple Pay Express"
                : "Google Pay Express"}
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
      <form onSubmit={handleSubmit} className="py-6 border-b border-[var(--border)] space-y-6">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[var(--text)] font-normal tracking-tight">
            3. Payment Method
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-light mt-1">
            All transactions are 256-bit encrypted via certified PCI-DSS Level 1 vault protocols.
          </p>
        </div>

        {/* Express Payment Options */}
        <div className="grid grid-cols-2 gap-3 pb-2">
          <button
            type="button"
            onClick={() => {
              onChange({ ...data, method: "apple_pay" });
              onContinue();
            }}
            className={`py-3 px-4 rounded-[2px] border text-xs font-sans font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              data.method === "apple_pay"
                ? "border-[var(--brand)] bg-[var(--surface-muted)]"
                : "border-[var(--border)] bg-white hover:border-[var(--brand)]"
            }`}
          >
            <span> Pay Express</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChange({ ...data, method: "google_pay" });
              onContinue();
            }}
            className={`py-3 px-4 rounded-[2px] border text-xs font-sans font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              data.method === "google_pay"
                ? "border-[var(--brand)] bg-[var(--surface-muted)]"
                : "border-[var(--border)] bg-white hover:border-[var(--brand)]"
            }`}
          >
            <span>G Pay Express</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[var(--border)] w-full" />
          <span className="absolute bg-white px-3 text-[11px] font-sans text-[var(--text-tertiary)] uppercase tracking-wider">
            Or pay with credit card
          </span>
        </div>

        {/* Card Fields */}
        <div className="space-y-4 pt-1">
          <div className="relative">
            <Input
              label="Card Number"
              name="cardnumber"
              autoComplete="cc-number"
              placeholder="4242 •••• •••• 4242"
              value={data.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              onBlur={validate}
              error={errors.cardNumber}
              required
              leftIcon={<CreditCard className="w-4 h-4" />}
            />
            {getCardBrand(data.cardNumber) && (
              <span className="absolute right-3.5 top-8 text-xs font-sans font-medium text-[var(--brand)] select-none">
                {getCardBrand(data.cardNumber)}
              </span>
            )}
          </div>

          <Input
            label="Name on Card"
            name="ccname"
            autoComplete="cc-name"
            placeholder="Eleanor Vance"
            value={data.cardholderName}
            onChange={(e) => {
              onChange({ ...data, cardholderName: e.target.value });
              if (errors.cardholderName) setErrors({ ...errors, cardholderName: "" });
            }}
            onBlur={validate}
            error={errors.cardholderName}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry (MM/YY)"
              name="ccexp"
              autoComplete="cc-exp"
              placeholder="08/29"
              value={data.expiry}
              onChange={(e) => handleExpiryChange(e.target.value)}
              onBlur={validate}
              error={errors.expiry}
              required
            />

            <Input
              label="Security CVC"
              name="cvc"
              autoComplete="cc-csc"
              placeholder="123"
              type="password"
              maxLength={4}
              value={data.cvc}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                onChange({ ...data, cvc: digits });
                if (errors.cvc) setErrors({ ...errors, cvc: "" });
              }}
              onBlur={validate}
              error={errors.cvc}
              required
              leftIcon={<Lock className="w-3.5 h-3.5" />}
            />
          </div>

          <Checkbox
            checked={data.billingSameAsShipping}
            onChange={(e) =>
              onChange({ ...data, billingSameAsShipping: (e.target as HTMLInputElement).checked })
            }
            label="Billing address matches delivery address"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full sm:w-auto h-11 px-8 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-sans font-medium uppercase tracking-[0.14em] rounded-[2px] transition-colors btn-press shadow-xs cursor-pointer"
          >
            Review Order
          </button>
        </div>
      </form>
    );
  }

  // Inactive Ahead View
  return (
    <div className="py-4 border-b border-[var(--border)] opacity-50 flex items-center gap-3 select-none">
      <div className="w-5 h-5 rounded-full border border-[var(--text-tertiary)] text-[var(--text-tertiary)] text-xs font-sans flex items-center justify-center">
        3
      </div>
      <div className="font-serif text-base text-[var(--text-secondary)]">
        3. Payment Authorization
      </div>
    </div>
  );
}
