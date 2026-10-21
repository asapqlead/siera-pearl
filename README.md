# Siera Pearl — Luxury Fine Pearl Jewelry Storefront

A modern, high-contrast, editorial luxury ecommerce storefront for **Siera Pearl** (~30 SKUs, USD), designed and engineered to the aesthetic and functional standards of Mejuri, Mikimoto, Brilliant Earth, and Catbird.

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**, following strict Emil Kowalski motion principles, authentic luxury typography, 4:5 portrait studio photography, and zero AI visual anti-patterns.

---

## 1. Design System & Philosophy

### Authentic Luxury Standard
- **Zero AI Visual Anti-Patterns:** Strictly no procedural SVG pearls, no sparkle/magic icons, no gold drop-shadows, no floating glow blobs, and no pill buttons.
- **Editorial Typography:** Display headlines set in **Cormorant Garamond** (high-contrast, editorial elegance); UI controls, body copy, and prices set in **Inter** with tabular digits (`tabular-nums`).
- **4:5 Studio Ratio:** Every product tile, gallery view, and recommendation adheres to a strict 4:5 portrait ratio, honoring traditional fine jewelry proportion.
- **Natural Canvas:** Backgrounds utilize warm ivory (`#FAF8F4`) and warm alabaster surfaces (`#FFFFFF` / `#F5F2EB`) rather than sterile blue-whites.
- **Restrained Motion:** Interfaces feel responsive and grounded via Emil Kowalski motion curves (`--ease-out`, `--ease-drawer`), tactile active compression (`scale(0.97)`), and 0.2–0.3s transitions.

### Color Tokens (WCAG 2.2 AA Compliant)

| Token | Hex Value | Purpose |
| :--- | :--- | :--- |
| `--bg` | `#FAF8F4` | Primary body background (warm ivory) |
| `--surface` | `#FFFFFF` | Card backgrounds and modal sheets |
| `--surface-muted` | `#F5F2EB` | Subtle containers and table headers |
| `--surface-hover` | `#EFECE4` | Interactive element hover states |
| `--border` | `#E5E0D8` | Hairline dividers and borders |
| `--border-strong` | `#8C6A2F` | Active focus rings and highlighted borders |
| `--text` | `#171513` | Primary headings and high-contrast copy |
| `--text-secondary`| `#5C5850` | Subtitles, specifications, and breadcrumbs |
| `--text-tertiary` | `#8E887E` | Metadata, placeholder hints, and notes |
| `--brand` | `#172A20` | Heritage deep hunter green (primary CTA fill) |
| `--brand-hover` | `#0F1D16` | Primary CTA hover state |
| `--accent` | `#8C6A2F` | Warm artisanal gold (WCAG AA 4.5:1 compliant) |

---

## 2. Architecture & File Structure

```
siera_pearl/
├── app/
│   ├── account/              # Tabbed customer dashboard (Orders, Addresses, Profile, Tracker)
│   ├── admin/                # Inventory and SKU management dashboard with photo previews
│   ├── care-guide/           # Pearl care rituals, wear recommendations, cleaning guide
│   ├── cart/                 # Dedicated full-page shopping bag
│   ├── catalog/              # Faceted catalog with URL-synced multi-select filters and sorting
│   ├── checkout/             # 4-step progressive accordion checkout & confirmation
│   ├── contact/              # Customer concierge form with Zod validation
│   ├── faq/                  # Categorized accordion FAQ (Shipping, Quality, Sizing, Care)
│   ├── not-found.tsx         # Curated luxury 404 page with search and popular links
│   ├── page.tsx              # Server-rendered 8-section luxury homepage
│   ├── products/[slug]/      # PDP: 4:5 zoom gallery, sticky buy box, size drawer, reviews
│   ├── robots.ts             # Search crawler directives
│   ├── shipping-returns/     # Delivery timeline, complimentary insured shipping policies
│   ├── sitemap.ts            # Dynamic sitemap indexing all 50 storefront routes
│   ├── size-guide/           # Interactive mm/in ring chart and wrist measurement guide
│   ├── story/                # Editorial brand narrative and ethical cultivation pillars
│   ├── styleguide/           # Interactive UI component library showcase
│   ├── wishlist/             # Saved items client with metal selection and "Move to Bag"
│   ├── globals.css           # Design tokens, theme variables, focus rings, motion curves
│   └── layout.tsx            # Root layout, Google Fonts injection, global providers
├── components/
│   ├── account/              # AccountDashboardClient, WishlistClient, AuthModal
│   ├── cart/                 # CartDrawer, CartLineItem, CrossSellRow
│   ├── catalog/              # CatalogClient, FilterBar, FilterChips, SortDropdown, MobileFilterSheet
│   ├── checkout/             # ContactStep, DeliveryStep, PaymentStep, ReviewStep, CheckoutSummary
│   ├── contact/              # ContactForm (Zod validated)
│   ├── home/                 # HomeHero, CategoryTiles, BestsellersSection, EditorialBand, etc.
│   ├── layout/               # AnnouncementBar, Header, MegaMenu, MobileNav, SearchOverlay, Footer
│   ├── product/              # ProductGallery, StickyBuyBox, ProductAccordions, SizeGuideDrawer, etc.
│   └── ui/                   # 20 atomic primitives: Button, Input, Select, Swatch, Drawer, Modal, etc.
├── context/
│   ├── CartContext.tsx       # Shopping bag state with localStorage sync & complimentary shipping
│   ├── ToastContext.tsx      # Restrained feedback notification system
│   └── WishlistContext.tsx   # Saved pieces state with "Move to Bag" integration
├── docs/
│   ├── image-supply-guide.md # Studio photography framing, aspect ratio, and folder conventions
│   └── rebuild-plan.md       # Complete 12-task architecture and verification record
├── lib/
│   ├── filter-utils.ts       # Pure URL search params synchronization and filter query helpers
│   ├── images.ts             # Centralized image registry with fallback and local override logic
│   ├── products.ts           # 30 master pearl jewelry SKUs with specifications and pricing
│   └── supabase.ts           # Supabase client initialization
└── types/
    ├── checkout.ts           # Checkout state and payment payload types
    └── product.ts            # Product, SKU, Filter, and Inventory interfaces
```

---

## 3. Key Storefront Features

### 1. Navigation & Search
- **Persistent Header:** 72px luxury header with logo, centered mega-menu categories (Necklaces, Earrings, Bracelets, Rings, Bridal, Our Story), search trigger, and badge counts.
- **Full-Width Search Overlay:** Animated slide-down search with live query suggestions, thumbnail previews, price tags, and quick-add links (`ESC` dismissible).
- **Mobile Navigation:** Smooth slide-out navigation sheet with nested accordions, search, and customer links, optimized for 360px and 390px viewports.

### 2. High-Performance Catalog (`/catalog`)
- **Single Source of Truth Filtering:** Horizontal desktop filter popovers and mobile filter sheet synced cleanly to URL search parameters (`?category=...&pearl=...&metal=...&sort=...`).
- **Zero Layout Shift:** Responsive 2-column (mobile) to 3-column (desktop) grid with 4:5 image cards, dual-photo hover cross-fades, metal swatches, and quick-add actions.

### 3. Product Detail Page (`/products/[slug]`)
- **Vertical Thumbnail Strip & Zoom:** Primary gallery with thumbnail selector, keyboard arrows, and a 1.65× detail hover loupe.
- **Sticky Buy Box:** Desktop sticky column with alloy swatches, ring/bracelet size chips with inline "Size Guide" drawer trigger, complimentary delivery estimate, and gift packaging notes.
- **Mobile Sticky Bar:** Bottom dock appears on mobile scroll with product title, price, and one-tap "Add to Bag" button.
- **Editorial Accordions:** Factual materials, dimensions, grading, and return policies.
- **Product Reviews & Recommendations:** Real customer feedback summaries and dynamic cross-sells.

### 4. Frictionless Cart & Checkout Flow
- **Direct Drawer on ATC:** Adding a piece slides open the slide-over `CartDrawer` immediately without intrusive full-screen redirects or redundant toasts.
- **Complimentary Shipping:** Free insured courier delivery on all orders, reinforced honestly across announcement bar, cart drawer, and checkout without contradictory threshold bars.
- **4-Step Dedicated Checkout (`/checkout`):**
  1. *Contact Information:* Email, SMS updates option, guest checkout default.
  2. *Delivery Address:* Structured street, apartment, city, state, postal code, phone.
  3. *Payment & Billing:* Express digital wallets (Apple Pay / Google Pay stubs), 16-digit credit card seam with luhn formatting and CVC, and gift card / promo code validation.
  4. *Order Review:* Itemized breakdown, insured courier verification, and order placement.
- **Order Confirmation (`/checkout/confirmation`):** Printable summary with generated order reference (`SP-XXXXXX`) and customer service details.

### 5. Clienteling, Account & Wishlist
- **Guest Wishlist:** Full client-side wishlist saved in `localStorage`, featuring alloy selection and one-click "Move to Bag" integration.
- **Account Dashboard (`/account`):** Tabbed interface with Order History (with tracking status badges), Saved Addresses, Personal Profile, and a standalone Guest Order Tracker.
- **Auth Modal:** Slide-over modal supporting Login, Registration, and Password Reset seamlessly from any page.

---

## 4. Studio Photography Ingestion

Siera Pearl is pre-configured with curated 4:5 editorial photography. Replacing these with real studio photography requires **zero code modifications**:

1. Consult [`docs/image-supply-guide.md`](file:///c:/Code/siera_pearl/docs/image-supply-guide.md) for framing guidelines and lighting rules.
2. Prepare 3 photos per SKU at **4:5 aspect ratio** (1200×1500px, warm ivory background `#FAF8F4`):
   - `01.jpg`: Primary studio still
   - `02.jpg`: Macro orient & craft detail
   - `03.jpg`: On-model lifestyle crop
3. Place files directly into `public/assets/images/products/<slug>/`:
   ```
   public/assets/images/products/
     ├── 01-classic-akoya-strand/
     │   ├── 01.jpg
     │   ├── 02.jpg
     │   └── 03.jpg
     └── 02-golden-solitaire-pendant/
         ├── 01.jpg
         └── ...
   ```
4. [`lib/images.ts`](file:///c:/Code/siera_pearl/lib/images.ts) will automatically prioritize your local studio photographs over the fallback registry.

---

## 5. Development & Verification

### Prerequisites
- Node.js 18.18+ or 20+
- npm 9+

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. View storefront
# Navigate to http://localhost:3000
```

### Build & Code Quality Commands
```bash
# Type check all TypeScript files
npx tsc --noEmit

# Run ESLint (Next.js 16 flat config)
npm run lint

# Compile production bundle (verifies all 50 routes)
npm run build
```

---

## 6. Route Directory (50 Total Routes)

| Path | Purpose |
| :--- | :--- |
| `/` | Luxury 8-section homepage |
| `/catalog` | Complete catalog with multi-faceted filtering & sorting |
| `/products/[slug]` | 30 individual dynamic product detail pages |
| `/cart` | Standalone shopping bag page |
| `/checkout` | 4-step accordion checkout flow |
| `/checkout/confirmation` | Order success & tracking receipt |
| `/account` | Customer account dashboard & guest tracker |
| `/wishlist` | Guest & customer saved pieces |
| `/story` | Brand story & ethical cultivation narrative |
| `/shipping-returns` | Shipping schedules & 30-day return policies |
| `/care-guide` | Pearl care & cleaning instructions |
| `/size-guide` | Ring and bracelet measurement guide |
| `/faq` | Frequently asked questions |
| `/contact` | Concierge message form |
| `/styleguide` | Interactive component library preview |
| `/admin` | Inventory stock manager |
| `/sitemap.xml` | Search engine index |
| `/robots.txt` | Crawler policy |

---

## 7. License & Credits

Designed and engineered for **Siera Pearl**. All rights reserved.
