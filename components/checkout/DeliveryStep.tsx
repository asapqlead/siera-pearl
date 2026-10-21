"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { DeliveryAddress } from "@/types/checkout";
import { ShippingOption } from "@/types/product";
import { SHIPPING_OPTIONS } from "@/context/CartContext";
import { formatMoney } from "@/lib/products";
import { Input } from "@/components/ui/Input";

export interface DeliveryStepProps {
  isActive: boolean;
  isCompleted: boolean;
  address: DeliveryAddress;
  onAddressChange: (address: DeliveryAddress) => void;
  selectedShipping: ShippingOption;
  onShippingChange: (option: ShippingOption) => void;
  onContinue: () => void;
  onEdit: () => void;
}

export function DeliveryStep({
  isActive,
  isCompleted,
  address,
  onAddressChange,
  selectedShipping,
  onShippingChange,
  onContinue,
  onEdit,
}: DeliveryStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!address.fullName.trim()) errs.fullName = "Full legal name is required";
    if (!address.addressLine1.trim()) errs.addressLine1 = "Street address is required";
    if (!address.city.trim()) errs.city = "City is required";
    if (!address.state.trim()) errs.state = "State / Province is required";
    if (!address.zipCode.trim()) errs.zipCode = "ZIP / Postal code is required";

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
              2. Delivery Address &amp; Courier
            </div>
            <div className="text-xs font-sans text-[var(--text-secondary)] mt-0.5 font-light">
              {address.fullName} · {address.addressLine1}, {address.city}, {address.state} {address.zipCode}
            </div>
            <div className="text-xs font-sans text-[var(--brand)] font-medium mt-0.5">
              {selectedShipping.name} ({selectedShipping.price === 0 ? "Complimentary" : formatMoney(selectedShipping.price)})
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
            2. Delivery Address &amp; Courier
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-light mt-1">
            All fine jewelry deliveries are insured in transit and shipped in discreet tamper-evident packaging.
          </p>
        </div>

        {/* Physical Address Fields */}
        <div className="space-y-4">
          <Input
            label="Full Legal Name"
            name="name"
            autoComplete="name"
            placeholder="Eleanor Vance"
            value={address.fullName}
            onChange={(e) => {
              onAddressChange({ ...address, fullName: e.target.value });
              if (errors.fullName) setErrors({ ...errors, fullName: "" });
            }}
            onBlur={validate}
            error={errors.fullName}
            required
          />

          <Input
            label="Street Address"
            name="address-line1"
            autoComplete="shipping address-line1"
            placeholder="740 Park Avenue"
            value={address.addressLine1}
            onChange={(e) => {
              onAddressChange({ ...address, addressLine1: e.target.value });
              if (errors.addressLine1) setErrors({ ...errors, addressLine1: "" });
            }}
            onBlur={validate}
            error={errors.addressLine1}
            required
          />

          <Input
            label="Apartment, Suite, Floor (Optional)"
            name="address-line2"
            autoComplete="shipping address-line2"
            placeholder="Apt 12B"
            value={address.addressLine2 || ""}
            onChange={(e) => onAddressChange({ ...address, addressLine2: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="City"
              name="city"
              autoComplete="shipping address-level2"
              placeholder="New York"
              value={address.city}
              onChange={(e) => {
                onAddressChange({ ...address, city: e.target.value });
                if (errors.city) setErrors({ ...errors, city: "" });
              }}
              onBlur={validate}
              error={errors.city}
              required
            />

            <Input
              label="State / Province"
              name="state"
              autoComplete="shipping address-level1"
              placeholder="NY"
              value={address.state}
              onChange={(e) => {
                onAddressChange({ ...address, state: e.target.value });
                if (errors.state) setErrors({ ...errors, state: "" });
              }}
              onBlur={validate}
              error={errors.state}
              required
            />

            <Input
              label="ZIP / Postal Code"
              name="postal-code"
              autoComplete="shipping postal-code"
              placeholder="10021"
              value={address.zipCode}
              onChange={(e) => {
                onAddressChange({ ...address, zipCode: e.target.value });
                if (errors.zipCode) setErrors({ ...errors, zipCode: "" });
              }}
              onBlur={validate}
              error={errors.zipCode}
              required
            />
          </div>
        </div>

        {/* Shipping Method Selector */}
        <div className="space-y-3 pt-4 border-t border-[var(--border)]">
          <label className="text-xs uppercase tracking-wider font-sans font-medium text-[var(--text)] block">
            Select Insured Courier Dispatch Method:
          </label>

          <div className="space-y-2.5">
            {SHIPPING_OPTIONS.map((opt) => {
              const isSelected = selectedShipping.id === opt.id;
              return (
                <label
                  key={opt.id}
                  onClick={() => onShippingChange(opt)}
                  className={`flex items-center justify-between p-3.5 rounded-[2px] border cursor-pointer transition-colors ${
                    isSelected
                      ? "border-[var(--brand)] bg-[var(--surface-muted)]"
                      : "border-[var(--border)] bg-white hover:border-[var(--brand)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping_method"
                      checked={isSelected}
                      onChange={() => onShippingChange(opt)}
                      className="accent-[var(--brand)] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-sans font-medium text-[var(--text)]">
                        {opt.name}
                      </div>
                      <div className="text-[11px] text-[var(--text-tertiary)] font-light mt-0.5">
                        {opt.days} · Signature required upon handover
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-sans font-medium tabular-nums text-[var(--text)]">
                    {opt.price === 0 ? "Complimentary" : formatMoney(opt.price)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full sm:w-auto h-11 px-8 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-sans font-medium uppercase tracking-[0.14em] rounded-[2px] transition-colors btn-press shadow-xs cursor-pointer"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    );
  }

  // Inactive Ahead View
  return (
    <div className="py-4 border-b border-[var(--border)] opacity-50 flex items-center gap-3 select-none">
      <div className="w-5 h-5 rounded-full border border-[var(--text-tertiary)] text-[var(--text-tertiary)] text-xs font-sans flex items-center justify-center">
        2
      </div>
      <div className="font-serif text-base text-[var(--text-secondary)]">
        2. Delivery Address &amp; Courier
      </div>
    </div>
  );
}
