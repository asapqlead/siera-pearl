"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ContactInfo, DeliveryAddress, PaymentInfo, OrderConfirmationData } from "@/types/checkout";
import { Header } from "@/components/layout/Header";
import { ContactStep } from "@/components/checkout/ContactStep";
import { DeliveryStep } from "@/components/checkout/DeliveryStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { ReviewStep } from "@/components/checkout/ReviewStep";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    cartSubtotal,
    promoCode,
    discountAmount,
    applyPromoCode,
    removePromoCode,
    selectedShipping,
    setSelectedShipping,
    isGiftWrap,
    giftMessage,
    clearCart,
    finalTotal,
  } = useCart();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [contactData, setContactData] = useState<ContactInfo>({
    email: "",
    phone: "",
    newsletterOptIn: true,
  });

  const [deliveryData, setDeliveryData] = useState<DeliveryAddress>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentData, setPaymentData] = useState<PaymentInfo>({
    method: "card",
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    billingSameAsShipping: true,
  });

  const markStepComplete = (stepNum: number, nextStep: 1 | 2 | 3 | 4) => {
    if (!completedSteps.includes(stepNum)) {
      setCompletedSteps([...completedSteps, stepNum]);
    }
    setActiveStep(nextStep);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const generatedOrderNumber = `SP-${Math.floor(100000 + Math.random() * 900000)}`;

      const confirmationPayload: OrderConfirmationData = {
        orderNumber: generatedOrderNumber,
        createdAt: new Date().toISOString(),
        contact: contactData,
        delivery: deliveryData,
        shippingOption: selectedShipping,
        items: [...cart],
        subtotal: cartSubtotal,
        discountAmount,
        promoCode,
        shippingPrice: selectedShipping.price,
        finalTotal,
        isGiftWrap,
        giftMessage,
      };

      try {
        localStorage.setItem("siera_pearl_last_order", JSON.stringify(confirmationPayload));
      } catch (e) {
        console.warn("Could not save order confirmation payload", e);
      }

      clearCart();
      setIsProcessing(false);
      router.push(`/checkout/confirmation?order=${generatedOrderNumber}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {/* Distraction-Free Header */}
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="site-container">
          {/* Breadcrumb Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Return to Shopping Bag</span>
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] font-sans">
              <Lock className="w-3.5 h-3.5 text-[var(--brand)] stroke-[1.5]" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>

          {/* Page Heading for WCAG Semantic Hierarchy */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text)] font-normal tracking-tight">
              Secure Checkout
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light mt-1">
              Complimentary insured courier delivery &middot; 30-day in-home evaluation
            </p>
          </div>

          {cartCount === 0 && !isProcessing ? (
            <div className="py-20 text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--text-tertiary)]">
                <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h2 className="font-serif text-2xl font-normal text-[var(--text)]">
                Your shopping bag is empty
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                Add an heirloom piece to proceed with white-glove checkout.
              </p>
              <div>
                <Link
                  href="/catalog"
                  className="inline-block bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white px-6 py-3 rounded-[2px] text-xs font-sans font-medium uppercase tracking-[0.14em] transition-colors btn-press shadow-xs"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
              {/* Left Column: Sequential Accordion Steps (7 Cols) */}
              <div className="lg:col-span-7 bg-white border border-[var(--border)] rounded-[2px] p-6 sm:p-8 space-y-1">
                {/* Step 1: Contact */}
                <ContactStep
                  isActive={activeStep === 1}
                  isCompleted={completedSteps.includes(1)}
                  data={contactData}
                  onChange={setContactData}
                  onContinue={() => markStepComplete(1, 2)}
                  onEdit={() => setActiveStep(1)}
                />

                {/* Step 2: Delivery */}
                <DeliveryStep
                  isActive={activeStep === 2}
                  isCompleted={completedSteps.includes(2)}
                  address={deliveryData}
                  onAddressChange={setDeliveryData}
                  selectedShipping={selectedShipping}
                  onShippingChange={setSelectedShipping}
                  onContinue={() => markStepComplete(2, 3)}
                  onEdit={() => setActiveStep(2)}
                />

                {/* Step 3: Payment */}
                <PaymentStep
                  isActive={activeStep === 3}
                  isCompleted={completedSteps.includes(3)}
                  data={paymentData}
                  onChange={setPaymentData}
                  onContinue={() => markStepComplete(3, 4)}
                  onEdit={() => setActiveStep(3)}
                />

                {/* Step 4: Review & Authorize */}
                <ReviewStep
                  isActive={activeStep === 4}
                  contact={contactData}
                  delivery={deliveryData}
                  shipping={selectedShipping}
                  payment={paymentData}
                  isGiftWrap={isGiftWrap}
                  giftMessage={giftMessage}
                  total={finalTotal}
                  isProcessing={isProcessing}
                  onPlaceOrder={handlePlaceOrder}
                />
              </div>

              {/* Right Column: Sticky Checkout Summary (5 Cols) */}
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <CheckoutSummary
                  items={cart}
                  subtotal={cartSubtotal}
                  discountAmount={discountAmount}
                  promoCode={promoCode}
                  onApplyPromo={applyPromoCode}
                  onRemovePromo={removePromoCode}
                  shippingOption={selectedShipping}
                  finalTotal={finalTotal}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
