import { CartItem, ShippingOption } from "./product";

export interface ContactInfo {
  email: string;
  phone: string;
  newsletterOptIn: boolean;
}

export interface DeliveryAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  method: "card" | "apple_pay" | "google_pay";
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  billingSameAsShipping: boolean;
}

export interface OrderConfirmationData {
  orderNumber: string;
  createdAt: string;
  contact: ContactInfo;
  delivery: DeliveryAddress;
  shippingOption: ShippingOption;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  promoCode: string | null;
  shippingPrice: number;
  finalTotal: number;
  isGiftWrap: boolean;
  giftMessage?: string;
}
