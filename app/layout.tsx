import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sierapearl.com"),
  title: "Siera Pearl — Fine Pearl Jewelry",
  description:
    "Natural Akoya, Tahitian, South Sea, and Freshwater pearls set in recycled 18k solid gold. Free insured shipping and 30-day returns.",
  icons: {
    icon: "/assets/images/logo.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--accent-muted)] selection:text-[var(--text)]">
        <ToastProvider>
          <WishlistProvider>
            <CartProvider>{children}</CartProvider>
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

