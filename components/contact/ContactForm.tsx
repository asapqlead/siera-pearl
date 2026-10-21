"use client";

import React, { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("Product Advice & Sizing");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketRef, setTicketRef] = useState("");

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Please provide your full name.";
    }

    if (!email.trim()) {
      nextErrors.email = "Please provide your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        nextErrors.email = "Please enter a valid email address.";
      }
    }

    if (!message.trim() || message.trim().length < 10) {
      nextErrors.message = "Please include a detailed message (at least 10 characters).";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate concierge dispatch
    setTimeout(() => {
      const ref = "SR-" + Math.floor(100000 + Math.random() * 900000);
      setTicketRef(ref);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 500);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="bg-white border border-[var(--border)] p-8 sm:p-10 rounded-[2px] text-center space-y-4 animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-800">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-2xl text-[var(--text)] font-normal">
          Inquiry Dispatched to Concierge
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-md mx-auto leading-relaxed">
          Thank you, {name}. Your inquiry has been routed to our senior gemologist under reference number <strong className="text-[var(--text)] font-mono">{ticketRef}</strong>.
        </p>
        <p className="text-xs text-[var(--text-tertiary)] font-light">
          We will review your request and reply unhurriedly within 24 business hours.
        </p>
        <div className="pt-4">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white border border-[var(--border)] p-8 rounded-[2px] space-y-5"
    >
      <div className="space-y-1">
        <h3 className="font-serif text-2xl text-[var(--text)] font-normal">
          Send a Private Message
        </h3>
        <p className="text-xs text-[var(--text-tertiary)] font-light">
          Fill out the details below and our team will get in touch.
        </p>
      </div>

      <Input
        label="Full Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
        }}
        error={errors.name}
        placeholder="Eleanor Sterling"
        required
      />

      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        error={errors.email}
        placeholder="name@domain.com"
        required
      />

      {/* Inquiry Type Select */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="inquiry-type"
          className="text-xs uppercase tracking-wider font-medium text-[var(--text)]"
        >
          Inquiry Topic
        </label>
        <select
          id="inquiry-type"
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value)}
          className="w-full h-11 px-3 bg-white border border-[var(--border)] text-sm rounded-[2px] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] text-[var(--text)]"
        >
          <option value="Product Advice & Sizing">Product Advice &amp; Sizing</option>
          <option value="Order & Delivery Status">Order &amp; Delivery Status</option>
          <option value="Bespoke Commission">Bespoke Commission or Custom Strand Length</option>
          <option value="Return or Exchange">Return or Exchange</option>
          <option value="Care & Restringing">Care &amp; Restringing Appraisal</option>
        </select>
      </div>

      {/* Message Textarea */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="inquiry-message"
          className="text-xs uppercase tracking-wider font-medium text-[var(--text)] flex items-center justify-between"
        >
          <span>Message</span>
          {errors.message && (
            <span className="text-xs text-red-600 font-normal lowercase tracking-normal">
              {errors.message}
            </span>
          )}
        </label>
        <textarea
          id="inquiry-message"
          rows={5}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
          }}
          placeholder="Please share details regarding your inquiry, preferred pearl variety, or specific questions..."
          className={`w-full p-3 bg-white border text-sm rounded-[2px] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] placeholder-[var(--text-tertiary)] ${
            errors.message ? "border-red-500" : "border-[var(--border)]"
          }`}
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        className="w-full mt-2"
      >
        <span>Submit Inquiry</span>
        <ArrowRight className="w-3.5 h-3.5 ml-2" />
      </Button>
    </form>
  );
}
