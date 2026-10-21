"use client";

import React, { useState } from "react";
import { Check, ArrowRight, Loader2 } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setError("Please enter your email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      setError("Please enter a valid email address (e.g. name@domain.com).");
      return false;
    }
    setError(null);
    return true;
  };

  const handleBlur = () => {
    if (email) {
      validateEmail(email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setIsSubmitting(true);

    // Simulate luxury dispatch and check local storage duplicates
    setTimeout(() => {
      try {
        const stored = localStorage.getItem("siera_pearl_newsletter_subscribers");
        const list: string[] = stored ? JSON.parse(stored) : [];

        if (list.includes(email.toLowerCase().trim())) {
          setSuccessMessage(
            "You are already subscribed to the Siera Journal. Thank you for your continued patronage."
          );
        } else {
          list.push(email.toLowerCase().trim());
          localStorage.setItem(
            "siera_pearl_newsletter_subscribers",
            JSON.stringify(list)
          );
          setSuccessMessage(
            "Thank you for subscribing. A welcome note with your private boutique access has been sent to your inbox."
          );
        }
      } catch {
        setSuccessMessage(
          "Thank you for subscribing. A welcome note has been sent to your inbox."
        );
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 450);
  };

  const handleReset = () => {
    setEmail("");
    setIsSuccess(false);
    setError(null);
  };

  return (
    <section className="py-20 sm:py-24 bg-[var(--brand)] text-white">
      <div className="site-container max-w-3xl text-center">
        {/* Overline */}
        <p className="text-xs uppercase tracking-[0.25em] text-white/70 font-medium mb-3">
          The Siera Journal
        </p>

        {/* Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight mb-4">
          Private Invitations &amp; New Harvests
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto font-light leading-relaxed mb-8">
          Subscribe to receive unhurried announcements of limited-harvest pearl releases, private exhibitions, and care insights. No spam, ever.
        </p>

        {isSuccess ? (
          <div className="bg-white/10 border border-white/20 p-6 rounded-[2px] max-w-md mx-auto space-y-3 animate-fade-in">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mx-auto text-white">
              <Check className="w-5 h-5" />
            </div>
            <p className="text-sm text-white font-light leading-relaxed">
              {successMessage}
            </p>
            <button
              onClick={handleReset}
              className="text-xs text-white/70 hover:text-white underline underline-offset-4 transition-colors font-light pt-2"
            >
              Subscribe another email address
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="max-w-md mx-auto space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  onBlur={handleBlur}
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? "newsletter-error" : undefined}
                  disabled={isSubmitting}
                  className={`w-full h-12 px-4 bg-white/10 border text-white placeholder-white/50 text-sm rounded-[2px] focus:outline-none focus:ring-2 focus:ring-white transition-all ${
                    error ? "border-red-400" : "border-white/20"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8 bg-white hover:bg-[var(--surface-muted)] active:scale-[0.98] text-[var(--brand)] text-xs uppercase tracking-widest font-semibold rounded-[2px] transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-white shrink-0"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--brand)]" />
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <p
                id="newsletter-error"
                className="text-xs text-red-200 text-left pt-1"
                role="alert"
              >
                {error}
              </p>
            )}

            <p className="text-[11px] text-white/60 font-light pt-1">
              By subscribing, you agree to our{" "}
              <a
                href="/shipping-returns"
                className="underline underline-offset-2 hover:text-white"
              >
                Privacy Terms
              </a>
              . You may withdraw consent at any time.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
