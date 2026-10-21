"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Tabs, TabItem } from "@/components/ui/Tabs";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Price } from "@/components/ui/Price";
import { EmptyState } from "@/components/ui/EmptyState";
import { AuthModal } from "@/components/account/AuthModal";
import { useToast } from "@/context/ToastContext";
import { OrderConfirmationData } from "@/types/checkout";
import { CartItem } from "@/types/product";

interface UserProfile {
  email: string;
  name: string;
  id?: string;
}

interface SavedAddress {
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

const DEFAULT_ADDRESS: SavedAddress = {
  fullName: "Eleanor Sterling",
  street: "740 Park Avenue",
  apartment: "Penthouse B",
  city: "New York",
  state: "NY",
  postalCode: "10021",
  country: "United States",
  phone: "+1 (212) 555-0198",
};

export function AccountDashboardClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>("orders");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Orders state
  const [orders, setOrders] = useState<OrderConfirmationData[]>([]);
  const [lookupOrderNum, setLookupOrderNum] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupResult, setLookupResult] = useState<OrderConfirmationData | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Address editing state
  const [address, setAddress] = useState<SavedAddress>(DEFAULT_ADDRESS);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<SavedAddress>(DEFAULT_ADDRESS);

  // Profile editing state
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("+1 (212) 555-0198");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);
  const [privateEventsSubscribed, setPrivateEventsSubscribed] = useState(true);

  useEffect(() => {
    // 1. Check Supabase session
    async function loadAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const u = {
            email: data.session.user.email || "",
            name:
              data.session.user.user_metadata?.full_name ||
              data.session.user.email?.split("@")[0] ||
              "Collector",
            id: data.session.user.id,
          };
          setUser(u);
          setProfileName(u.name);
          return;
        }
      } catch (e) {
        console.warn("Supabase auth check:", e);
      }

      // Check localStorage fallback
      try {
        const savedUser = localStorage.getItem("siera_pearl_user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setProfileName(parsed.name || parsed.email.split("@")[0]);
        }
      } catch (e) {
        console.warn("Could not parse saved user:", e);
      }
    }
    loadAuth();

    // 2. Load Placed Orders
    try {
      const orderList: OrderConfirmationData[] = [];
      const storedLast = localStorage.getItem("siera_pearl_last_order");
      if (storedLast) {
        orderList.push(JSON.parse(storedLast));
      }
      const storedAll = localStorage.getItem("siera_pearl_orders");
      if (storedAll) {
        const parsed = JSON.parse(storedAll);
        if (Array.isArray(parsed)) {
          parsed.forEach((o: OrderConfirmationData) => {
            if (!orderList.find((existing) => existing.orderNumber === o.orderNumber)) {
              orderList.push(o);
            }
          });
        }
      }
      setOrders(orderList);
    } catch (e) {
      console.warn("Could not load orders:", e);
    }

    // 3. Load Saved Address
    try {
      const storedAddress = localStorage.getItem("siera_pearl_shipping_address");
      if (storedAddress) {
        const parsed = JSON.parse(storedAddress);
        setAddress(parsed);
        setAddressForm(parsed);
      }
    } catch (e) {
      console.warn("Could not load address:", e);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Sign out", e);
    }
    localStorage.removeItem("siera_pearl_user");
    setUser(null);
    showToast({
      message: "Signed Out",
      description: "You have securely signed out of your account.",
    });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddress(addressForm);
    localStorage.setItem("siera_pearl_shipping_address", JSON.stringify(addressForm));
    setIsEditingAddress(false);
    showToast({
      message: "Address Saved",
      description: "Your default delivery destination has been updated.",
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated = { ...user, name: profileName };
    setUser(updated);
    localStorage.setItem("siera_pearl_user", JSON.stringify(updated));
    showToast({
      message: "Profile Updated",
      description: "Your account details and preferences have been updated.",
    });
  };

  const handleGuestLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setLookupResult(null);

    const queryNum = lookupOrderNum.trim().toUpperCase();
    const queryEmail = lookupEmail.trim().toLowerCase();

    const matched = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === queryNum &&
        o.contact.email.toLowerCase() === queryEmail
    );

    if (matched) {
      setLookupResult(matched);
    } else {
      setLookupError(
        "No matching order found. Please check your order reference number (e.g. SP-849201) and email address."
      );
    }
  };

  const tabItems: TabItem[] = [
    { id: "orders", label: "Order History", count: orders.length },
    { id: "addresses", label: "Delivery Addresses" },
    { id: "profile", label: "Account Details" },
  ];

  return (
    <div className="site-container py-10 sm:py-16">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Account" },
        ]}
        className="mb-6"
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border)] pb-6 mb-10 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text)] font-normal tracking-tight">
            {user ? `Welcome back, ${user.name}` : "Patron Account"}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light mt-1">
            {user
              ? `Signed in as ${user.email} · Siera Collector`
              : "Access your purchase records, tracking, and appraisal certificates"}
          </p>
        </div>

        {user ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            <span>Sign Out</span>
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAuthMode("login");
                setAuthModalOpen(true);
              }}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setAuthMode("register");
                setAuthModalOpen(true);
              }}
            >
              Create Account
            </Button>
          </div>
        )}
      </div>

      {/* If Not Logged In: Guest Mode & Lookup */}
      {!user ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Sign In Invitation */}
          <div className="lg:col-span-6 bg-[var(--surface-muted)] border border-[var(--border)] p-8 rounded-[2px] space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                Collector Services
              </span>
              <h2 className="font-serif text-2xl text-[var(--text)] font-normal">
                Sign In to Your Vault
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                Registered collectors enjoy unhurried order tracking, certificate of appraisal archival, saved destinations, and invitations to limited lagoon harvest releases.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setAuthMode("login");
                  setAuthModalOpen(true);
                }}
              >
                Sign In with Password
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setAuthMode("register");
                  setAuthModalOpen(true);
                }}
              >
                Register an Account
              </Button>
            </div>

            <div className="pt-6 border-t border-[var(--border)] grid grid-cols-2 gap-4 text-xs text-[var(--text-secondary)] font-light">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--brand)]" />
                <span>Encrypted Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[var(--brand)]" />
                <span>Insured Dispatch History</span>
              </div>
            </div>
          </div>

          {/* Right Column: Guest Order Lookup */}
          <div className="lg:col-span-6 bg-white border border-[var(--border)] p-8 rounded-[2px] space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                Guest Orders
              </span>
              <h2 className="font-serif text-2xl text-[var(--text)] font-normal">
                Check Order Status
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                Placed an order as a guest? Enter your order confirmation number and email address below to review courier dispatch status.
              </p>
            </div>

            <form onSubmit={handleGuestLookup} className="space-y-4">
              <Input
                label="Order Reference Number"
                value={lookupOrderNum}
                onChange={(e) => setLookupOrderNum(e.target.value)}
                placeholder="e.g. SP-849201"
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                placeholder="name@domain.com"
                required
              />

              {lookupError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-[2px]">
                  {lookupError}
                </div>
              )}

              <Button type="submit" variant="primary" size="md" className="w-full">
                <Search className="w-3.5 h-3.5 mr-1.5" />
                <span>Locate Order</span>
              </Button>
            </form>

            {/* Display Lookup Result */}
            {lookupResult && (
              <div className="mt-6 p-6 bg-[var(--surface-muted)] border border-[var(--border)] rounded-[2px] space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <div>
                    <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
                      Order Reference
                    </span>
                    <h4 className="font-serif text-lg text-[var(--text)] font-medium">
                      {lookupResult.orderNumber}
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-emerald-100 text-emerald-800 rounded-[2px]">
                    <CheckCircle2 className="w-3 h-3" />
                    Authorized
                  </span>
                </div>

                <div className="text-xs space-y-1 text-[var(--text-secondary)] font-light">
                  <p>
                    <strong className="font-medium text-[var(--text)]">Courier Method:</strong>{" "}
                    {lookupResult.shippingOption?.name || "Complimentary Insured Courier"}
                  </p>
                  <p>
                    <strong className="font-medium text-[var(--text)]">Destination:</strong>{" "}
                    {lookupResult.delivery?.city}, {lookupResult.delivery?.country}
                  </p>
                  <p>
                    <strong className="font-medium text-[var(--text)]">Total Authorized:</strong>{" "}
                    ${lookupResult.finalTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/checkout/confirmation?orderId=${lookupResult.orderNumber}`}
                    className="text-xs uppercase tracking-wider font-semibold text-[var(--brand)] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Complete Itemized Receipt</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Logged In Dashboard with Tabs */
        <div>
          <Tabs
            items={tabItems}
            activeId={activeTab}
            onChange={setActiveTab}
            className="mb-8"
          />

          {/* TAB 1: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <EmptyState
                  title="No Orders Yet"
                  description="When you acquire pieces from Siera Pearl, your full dispatch tracking history, insured courier updates, and appraisal records will appear here."
                  actionLabel="Explore Fine Collection"
                  onAction={() => router.push("/catalog")}
                />
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.orderNumber}
                      className="bg-white border border-[var(--border)] rounded-[2px] overflow-hidden text-left"
                    >
                      {/* Order Header */}
                      <div className="bg-[var(--surface-muted)] px-6 py-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div className="flex flex-wrap items-center gap-6">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] block">
                              Order Placed
                            </span>
                            <span className="font-medium text-[var(--text)]">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] block">
                              Order Number
                            </span>
                            <span className="font-mono font-medium text-[var(--text)]">
                              {order.orderNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] block">
                              Total
                            </span>
                            <span className="font-medium text-[var(--text)]">
                              ${order.finalTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-[2px]">
                            <Truck className="w-3 h-3" />
                            GPS Courier Dispatched
                          </span>
                          <Link
                            href={`/checkout/confirmation?orderId=${order.orderNumber}`}
                            className="text-xs uppercase tracking-wider font-semibold text-[var(--brand)] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Receipt</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Line Items */}
                      <div className="p-6 divide-y divide-[var(--border)]">
                        {order.items.map((item: CartItem, idx: number) => (
                          <div
                            key={idx}
                            className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative w-14 h-17 bg-[var(--surface-muted)] flex-shrink-0 overflow-hidden rounded-[2px]">
                                {item.product.photos?.[0] ? (
                                  <Image
                                    src={item.product.photos[0]}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)] text-[10px]">
                                    Jewel
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-serif text-base text-[var(--text)] font-medium">
                                  {item.product.name}
                                </h4>
                                <p className="text-xs text-[var(--text-tertiary)] font-light">
                                  {item.metal} &middot; Qty: {item.qty}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Price price={item.product.price * item.qty} className="text-sm" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Status Strip */}
                      <div className="bg-[var(--surface-muted)]/50 px-6 py-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] font-light flex items-center justify-between">
                        <span>
                          Shipped to: {order.delivery?.fullName || "Recipient"}, {order.delivery?.city || "Destination"}
                        </span>
                        <span>Estimated Arrival: {order.shippingOption?.days || "2–3 business days"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="max-w-2xl">
              <div className="bg-white border border-[var(--border)] p-8 rounded-[2px] space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div>
                    <h3 className="font-serif text-xl text-[var(--text)] font-medium">
                      Default Delivery Destination
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)] font-light mt-0.5">
                      Your primary address for complimentary insured courier dispatch.
                    </p>
                  </div>
                  {!isEditingAddress && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingAddress(true)}
                    >
                      Edit Address
                    </Button>
                  )}
                </div>

                {isEditingAddress ? (
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <Input
                      label="Recipient Full Name"
                      value={addressForm.fullName}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, fullName: e.target.value })
                      }
                      required
                    />

                    <Input
                      label="Street Address"
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, street: e.target.value })
                      }
                      required
                    />

                    <Input
                      label="Apartment, Suite, Unit (Optional)"
                      value={addressForm.apartment}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, apartment: e.target.value })
                      }
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <Input
                        label="City"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, city: e.target.value })
                        }
                        required
                      />
                      <Input
                        label="State / Region"
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, state: e.target.value })
                        }
                        required
                      />
                      <Input
                        label="Postal Code"
                        value={addressForm.postalCode}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, postalCode: e.target.value })
                        }
                        required
                      />
                    </div>

                    <Input
                      label="Phone Number (for Courier Delivery Notice)"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, phone: e.target.value })
                      }
                      required
                    />

                    <div className="pt-2 flex items-center gap-3">
                      <Button type="submit" variant="primary" size="md">
                        Save Destination
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={() => setIsEditingAddress(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-sm space-y-1.5 text-[var(--text-secondary)] font-light leading-relaxed">
                    <p className="font-medium text-[var(--text)]">{address.fullName}</p>
                    <p>{address.street}</p>
                    {address.apartment && <p>{address.apartment}</p>}
                    <p>
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                    <p className="pt-2 text-xs text-[var(--text-tertiary)]">
                      Courier Phone: {address.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE / ACCOUNT DETAILS */}
          {activeTab === "profile" && (
            <div className="max-w-2xl">
              <div className="bg-white border border-[var(--border)] p-8 rounded-[2px] space-y-6">
                <div>
                  <h3 className="font-serif text-xl text-[var(--text)] font-medium">
                    Personal Details &amp; Preferences
                  </h3>
                  <p className="text-xs text-[var(--text-tertiary)] font-light mt-0.5">
                    Update your collector profile, delivery notification contact, and journal subscriptions.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <Input
                    label="Full Name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={user.email}
                    disabled
                    hint="Email address cannot be modified once verified."
                  />

                  <Input
                    label="Courier Notification Phone"
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                  />

                  <div className="pt-4 border-t border-[var(--border)] space-y-3">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--text)]">
                      Communication Preferences
                    </h4>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newsletterSubscribed}
                        onChange={(e) => setNewsletterSubscribed(e.target.checked)}
                        className="mt-0.5 rounded-[2px] border-[var(--border)] text-[var(--brand)] focus:ring-[var(--brand)]"
                      />
                      <div className="text-xs text-[var(--text-secondary)] font-light">
                        <span className="font-medium text-[var(--text)] block">
                          The Siera Journal
                        </span>
                        Receive unhurried notifications of limited-harvest pearl releases and atelier care insights.
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privateEventsSubscribed}
                        onChange={(e) => setPrivateEventsSubscribed(e.target.checked)}
                        className="mt-0.5 rounded-[2px] border-[var(--border)] text-[var(--brand)] focus:ring-[var(--brand)]"
                      />
                      <div className="text-xs text-[var(--text-secondary)] font-light">
                        <span className="font-medium text-[var(--text)] block">
                          Private Harvest Exhibitions
                        </span>
                        Receive exclusive invitations to private viewings and bespoke commissions.
                      </div>
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" variant="primary" size="md">
                      Update Profile
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Auth Modal for Sign In / Register from Account Page */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={(loggedUser) => {
          setUser({
            email: loggedUser.email,
            name: loggedUser.name || loggedUser.email.split("@")[0],
          });
          setProfileName(loggedUser.name || loggedUser.email.split("@")[0]);
        }}
      />
    </div>
  );
}
