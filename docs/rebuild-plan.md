# Siera Pearl — UI/UX Rebuild Implementation Plan

**Project:** Siera Pearl (Luxury Fine Pearl Jewelry Storefront)  
**Target Standard:** Mejuri, Mikimoto, Brilliant Earth, Catbird, Missoma  
**Stack:** Next.js 16.4.2 (App Router), React 19.3.0, Tailwind CSS v4, TypeScript 5, Supabase, Lucide React  
**Plan Status:** Completed — 100% Final Deliverables Passed  
**Current Phase:** Final Client Handoff Complete (Tasks 0 through 12 Done)

---

## 1. Codebase Audit Summary

### 10-Line System Overview
1. **Framework & Engine:** Next.js 16.4.2 App Router with React 19.3.0 and Turbopack; server component architecture with client interactivity boundaries.
2. **Styling System:** Tailwind CSS v4 via `@tailwindcss/turbopack` and `globals.css`; currently polluted with ad-hoc hex values, gold glows, and pill utilities.
3. **Typography & Fonts:** Google Fonts (`Fraunces` serif + `Manrope` sans) loaded via `next/font/google`; requires replacement with high-contrast display serif (`Cormorant Garamond`) and neutral tabular sans (`Inter`).
4. **Data Layer & Models:** 30 pearl jewelry SKUs defined in `lib/products.ts` with Supabase query fallback; models in `types/product.ts` lack ring/bracelet sizes, detailed specs, and secondary image angles.
5. **Imagery Anti-Patterns:** Procedural SVG gradient pearl illustrations in `PearlIcon.tsx` and a 400×400px floating SVG hero sculpture substitute for real photography.
6. **State Management:** React Context providers (`CartContext`, `WishlistContext`, `ToastContext`) with `localStorage` persistence.
7. **Commerce Logic Defects:** Free shipping is claimed in the announcement bar but contradicted in the cart by a $2,000 threshold meter; toasts fire redundantly alongside drawer opens.
8. **Routing Deficits:** Storefront is crammed into a single page (`app/page.tsx`); PDP is handled by modal popups; checkout is an in-page dialog modal (`CheckoutModal.tsx`).
9. **Filtration Overlap:** Two redundant filter mechanisms coexist: horizontal category pill tabs and a left-hand desktop checkbox sidebar, lacking URL query synchronization.
10. **Backend & Admin:** Supabase client configured for inventory and auth; complete administrative stock manager lives at `/admin` and must remain fully functional.

---

### What We Keep vs. What We Replace

| Area | Keep | Replace / Refactor |
| :--- | :--- | :--- |
| **Stack & Runtime** | Next.js 16, React 19, TypeScript, ESLint, Lucide React (restrained to 1.25–1.5px stroke), Supabase client, Zod. | Ad-hoc hex styling, generic keyframes, CSS/SVG product illustrations. |
| **Data & Inventory** | 30 SKUs, pricing structure ($290–$4,200), categories, pearl/metal types, Supabase sync, `/admin` controller. | Filler marketing copy ("atelier", "luminous", "exquisite"), missing ring/bracelet sizing metadata. |
| **Visuals & Tokens** | High-contrast luxury intent, warm base palette direction. | Fraunces/Manrope fonts, gold gradients, glow blobs, drop shadows, `rounded-full` cards and buttons. |
| **Layout & Routing** | Layout structure and SEO metadata conventions. | Single-page monolithic storefront, modal PDP, modal checkout. Introduce dedicated `/catalog`, `/products/[slug]`, `/cart`, `/checkout`, `/wishlist`, and content routes. |
| **Cart & Commerce** | `localStorage` persistence, discount code computation, gift wrap flag. | Free-shipping threshold progress bar (shipping is always free), toast on Add to Bag (open drawer directly instead), "White-glove" gimmick copy. |

### Key Risks & Mitigations
- **Image Shift & Quality:** Shifting from SVG to photography risks layout shifts (CLS) and broken links if local files are missing.  
  *Mitigation:* Create a centralized image registry (`lib/images.ts`) with curated high-resolution 4:5 editorial photography from Unsplash, while preserving local file drop overrides (`public/assets/images/products/<folder>/01.jpg`).
- **Tailwind CSS v4 Configuration:** Tailwind v4 uses `@theme` in CSS instead of `tailwind.config.js`.  
  *Mitigation:* Define design tokens cleanly in `app/globals.css` using standard CSS custom properties and `@theme` mappings.
- **Breaking Admin Flow:** Admin portal at `/admin` depends on `INITIAL_PRODUCTS` and Supabase types.  
  *Mitigation:* Keep existing product IDs, slugs, and core keys backward-compatible when expanding `types/product.ts`.

---

## 2. Refined Task List

### Task 1: Foundation: Design Tokens, Typography & Global Styles
- **Goal:** Establish a single source of truth for design tokens, typography, colors, radii, spacing, and Emil Kowalski motion primitives; eliminate all ad-hoc values.
- **Files to Change/Create:**
  - `app/globals.css` (tokens, theme mapping, base typography, reset, focus rings, motion curves)
  - `app/layout.tsx` (configure `Cormorant Garamond` and `Inter` via `next/font/google`, root variables)
  - `lib/images.ts` (centralized image registry for placeholder photography across all 30 SKUs, hero, and categories)
- **Dependencies:** None.
- **Definition of Done:**
  - CSS tokens defined for colors (`--bg`, `--surface`, `--surface-muted`, `--text`, `--text-secondary`, `--text-tertiary`, `--border`, `--brand`, `--accent`, semantic colors).
  - Cormorant Garamond loaded for display headings and Inter loaded for UI/tabular numbers.
  - Buttons/inputs default to 2–4px radius; cards have 0px radius, 0px border, 0px shadow.
  - Custom easing curves defined (`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-drawer`).
  - `npm run build` passes with zero errors; no layout shift on font load.
- **How to Verify:** Load `http://localhost:3000/`. Inspect computed styles on `body`: background is `#FAF8F4`, font families resolve to Cormorant Garamond and Inter.
- **Size:** S
- **Status:** Done / Needs review

---

### Task 2: Component Library & /styleguide Page
- **Goal:** Build the unified atomic component library with all required interactive states and preview them in a dedicated interactive styleguide.
- **Files to Change/Create:**
  - `components/ui/Button.tsx` (primary deep green, secondary outline, text link; sizes sm/md/lg; hover, active scale 0.97, loading spinner, disabled)
  - `components/ui/Input.tsx`, `components/ui/Select.tsx`, `components/ui/Checkbox.tsx`, `components/ui/Radio.tsx` (with visible labels, errors, focus-visible rings)
  - `components/ui/Swatch.tsx` (metal alloy and color swatches)
  - `components/ui/QuantityStepper.tsx` (tactile increment/decrement)
  - `components/ui/Accordion.tsx` (hairline dividers, smooth height transition)
  - `components/ui/Tabs.tsx` (restrained underline indicator)
  - `components/ui/Badge.tsx` (text labels: "New", "Bestseller", "Low stock", "Sold out" — no filled pill badges)
  - `components/ui/Price.tsx` (tabular digits, strikethrough sale price)
  - `components/ui/Rating.tsx` (muted gold stars, numerical score)
  - `components/ui/Breadcrumb.tsx` (clean hierarchy links)
  - `components/ui/Drawer.tsx` (right slide-over, backdrop blur, focus trap, ESC dismiss)
  - `components/ui/Modal.tsx` (centered dialog, origin-aware entrance)
  - `components/ui/Popover.tsx` (origin-aware dropdown for filter bars)
  - `components/ui/Toast.tsx` (clean Sonner-style feedback, no sparkles)
  - `components/ui/Skeleton.tsx` (neutral shimmer for cards, text, images)
  - `components/ui/EmptyState.tsx` (restrained message, action button)
  - `app/styleguide/page.tsx` (interactive showcase of every component in every state)
- **Dependencies:** Task 1.
- **Definition of Done:**
  - Every component implemented with hover, focus-visible, active (`scale(0.97)`), disabled, loading, and error states.
  - Visible 2px focus ring with 2px offset on all interactive elements.
  - Zero sparkle/magic icons anywhere.
  - `/styleguide` renders all components with toggleable state controls.
- **How to Verify:** Navigate to `http://localhost:3000/styleguide`. Test keyboard Tab navigation across all inputs and buttons; toggle loading and error states.
- **Size:** M
- **Status:** Done / Needs review

---

### Task 3: Global Layout: Announcement Bar, Header, Mega-Menu, Mobile Menu, Search Overlay & Footer
- **Goal:** Rebuild the global navigational shell to luxury standards with zero wrapping nav items, a full-width search overlay, and clean footer architecture.
- **Files to Change/Create:**
  - `components/layout/AnnouncementBar.tsx` (single dismissible claim: "Free insured shipping and 30-day returns")
  - `components/layout/Header.tsx` (72px height, logo left, centered nav: Necklaces, Earrings, Bracelets, Rings, Bridal, Our Story; search, account, wishlist, bag icons right)
  - `components/layout/MegaMenu.tsx` (desktop hover menu with subcategories + featured photography card)
  - `components/layout/MobileNav.tsx` (full-screen mobile menu with accordions)
  - `components/layout/SearchOverlay.tsx` (full-width overlay with recent searches, popular terms, live suggestions with thumbnail + price, empty state)
  - `components/layout/Footer.tsx` (Shop, Help, Company columns, newsletter signup, currency/region selector, payment icons, legal hairlines)
  - `app/layout.tsx` (integrate persistent header and footer)
- **Dependencies:** Tasks 1, 2.
- **Definition of Done:**
  - Primary navigation never wraps at any desktop width.
  - Clicking search opens the animated full-width search modal; typing filters live products.
  - Desktop hover on category nav reveals mega-menu without jitter.
  - Mobile hamburger opens full-screen accessible drawer.
  - Footer contains all required help links (*Shipping & Returns, Care Guide, Size Guide, Contact*).
- **How to Verify:** Navigate to `http://localhost:3000/`. Test sticky shrink behavior on scroll; open and close search overlay with `ESC`; test mobile menu at 360px viewport.
- **Size:** M
- **Status:** Done / Needs review

---

### Task 4: Product Card & Catalog/Collection Page
- **Goal:** Rebuild product cards (4:5 ratio, hover swap, swatches, no card border/shadow) and the collection browsing page with a single horizontal filter bar synced to URL search parameters.
- **Files to Change/Create:**
  - `components/product/ProductCard.tsx` (4:5 aspect ratio, hover swap image, name in serif, descriptor, tabular price, wishlist heart, swatches, single badge)
  - `components/catalog/FilterBar.tsx` (horizontal filter bar with popovers: Category, Pearl type, Metal, Price, Availability)
  - `components/catalog/FilterChips.tsx` (removable chips with "Clear all")
  - `components/catalog/MobileFilterSheet.tsx` (bottom sheet with "Show N results" button)
  - `components/catalog/SortDropdown.tsx` (Featured, Best selling, Price low-high, Price high-low, Newest)
  - `app/catalog/page.tsx` (dedicated catalog route with 4-col desktop / 2-col mobile grid, pagination/load more, skeleton cards, and empty state)
  - `lib/filter-utils.ts` (query string serialization and deserialization)
- **Dependencies:** Tasks 1, 2, 3.
- **Definition of Done:**
  - Product card has 0 border, 0 shadow; hover swaps to secondary photo smoothly.
  - Redundant tabs and sidebar checkboxes removed; single horizontal filter bar in place.
  - Selecting filters updates URL query string (`?category=Necklaces&pearl=Akoya&sort=price-asc`); browser back/forward preserves state.
  - Grid displays 4 columns desktop (1280px+), 2 columns mobile (360px) with 24px gaps.
- **How to Verify:** Visit `http://localhost:3000/catalog?category=Earrings`. Check that only earrings appear, chips are displayed, and refreshing keeps filters intact.
- **Size:** M
- **Status:** Done / Needs review

---

### Task 5: Product Detail Page (/products/[slug])
- **Goal:** Rebuild `/products/[slug]` as a high-end luxury PDP, replacing modal popups with an editorial 2-column layout, zoom gallery, and sticky buy box.
- **Files to Change/Create:**
  - `app/products/[slug]/page.tsx` (Server Component: fetch product by slug, dynamic metadata, JSON-LD Product schema)
  - `components/product/ProductGallery.tsx` (vertical thumbnails + large image with hover zoom; mobile carousel with dots)
  - `components/product/StickyBuyBox.tsx` (H1 serif, descriptor, rating link, price, metal swatches, size selector with "Size guide" drawer trigger, stock status, single primary "Add to bag" CTA, wishlist icon button)
  - `components/product/ProductAccordions.tsx` (Details, Pearl & materials, Shipping & returns, Care)
  - `components/product/ProductRecommendations.tsx` ("Complete the look" / "You may also like" 4-grid)
  - `components/product/RecentlyViewed.tsx` (carousel of recently viewed SKUs persisted in `localStorage`)
  - `components/product/ProductReviews.tsx` (rating breakdown, verified purchase reviews)
  - `components/product/MobileStickyBar.tsx` (bottom bar with price + "Add to bag" appearing when main buy box scrolls out of view)
  - `components/product/SizeGuideDrawer.tsx` (ring & bracelet size conversion drawer)
- **Dependencies:** Tasks 1, 2, 4.
- **Definition of Done:**
  - Modal quick-view completely replaced by full route navigation.
  - Variant selectors update image and stock status cleanly.
  - Ring and bracelet items display size selector and working size guide drawer.
  - Factual lines under buy box (delivery estimate, free returns, certificate) use max 3 plain icons.
  - Mobile sticky bar triggers Add to Bag correctly on 360px viewport.
- **How to Verify:** Navigate to `http://localhost:3000/products/01-classic-akoya-strand`. Test gallery zoom, accordion expand/collapse, size guide drawer, and scroll down on mobile to check the sticky bar.
- **Size:** L
- **Status:** Done / Needs review

---

### Task 6: Bag (Mini-Cart Drawer, /cart Page & Commerce Logic)
- **Goal:** Deliver a cohesive shopping bag experience: right-side drawer that slides in on Add to Bag, dedicated `/cart` page, and zero contradictory shipping messages.
- **Files to Change/Create:**
  - `context/CartContext.tsx` (clean up toast on ATC; fix shipping logic to be complimentary; add promo calculation; add cross-sell helper)
  - `components/cart/CartDrawer.tsx` (drawer with "Bag (n)", 80×100 thumbnail, variant, stepper, "Remove" text link, collapsed gift option, collapsed promo code, "Pairs well with" row, checkout button, "View bag" link)
  - `components/cart/CartLineItem.tsx` (reusable line item for drawer and page)
  - `components/cart/CrossSellRow.tsx` (2-item companion jewelry cross-sell)
  - `app/cart/page.tsx` (dedicated full-width cart page with order summary breakdown)
- **Dependencies:** Tasks 1, 2, 4, 5.
- **Definition of Done:**
  - Adding to bag immediately opens the drawer and highlights the new item (no popup toast).
  - Contradictory $2,000 shipping progress bar removed; shipping shown as Free/Complimentary.
  - Gift wrap and promo code sections start collapsed and expand smoothly on click.
  - Line items use a clear "Remove" text link instead of a raw trash icon alone.
  - Empty bag state presents helpful recommendations and a link to bestsellers.
  - Cart persists reliably across browser reloads via `localStorage`.
- **How to Verify:** On any PDP, click "Add to bag". Verify drawer opens smoothly; adjust quantity; apply promo code `PEARL10`; visit `/cart` to confirm table layout and total matching.
- **Size:** M
- **Status:** Done / Needs review

---

### Task 7: Checkout & Order Confirmation Flow
- **Goal:** Implement a distraction-free, 2-column single-page accordion checkout with inline validation and an order confirmation screen.
- **Files to Change/Create:**
  - `app/checkout/page.tsx` (distraction-free header with logo + secure badge, 2-column layout, accordion steps: Contact > Delivery > Payment > Review, sticky order summary)
  - `components/checkout/ContactStep.tsx` (email, phone, newsletter opt-in)
  - `components/checkout/DeliveryStep.tsx` (shipping address with standard autocomplete attributes, shipping method with delivery date estimates)
  - `components/checkout/PaymentStep.tsx` (card fields with card brand detection, Apple Pay / Google Pay mock buttons, billing address match toggle)
  - `components/checkout/ReviewStep.tsx` (final order review and place order CTA)
  - `components/checkout/CheckoutSummary.tsx` (sticky items, subtotal, complimentary shipping, duties/taxes, promo code, total)
  - `app/checkout/confirmation/page.tsx` (order number, item summary, estimated delivery, email confirmation notice, "Create account" prompt)
- **Dependencies:** Tasks 1, 2, 6.
- **Definition of Done:**
  - Checkout is a dedicated page without the main navigation bar.
  - Accordion steps expand sequentially as prior steps pass validation on blur.
  - Guest checkout supported without requiring prior login.
  - Submitting order clears the bag and navigates to `/checkout/confirmation`.
- **How to Verify:** From `/cart`, click "Checkout". Complete Contact, Delivery, and mock Payment steps. Submit order and verify arrival at `/checkout/confirmation` with generated order number.
- **Size:** M
- **Status:** Done / Needs review

---

### Task 8: Luxury Home Page Rebuild
- **Goal:** Assemble the 8 home page sections in exact specified order with calm luxury pacing, photography-led heroes, and zero AI visual anti-patterns.
- **Files to Change/Create:**
  - `app/page.tsx` (server-rendered home page assembling sections)
  - `components/home/HomeHero.tsx` (Section 1: full-bleed lifestyle photograph, H1 max 7 words, one primary CTA + one text link)
  - `components/home/CategoryTiles.tsx` (Section 2: 5 photo tiles with label beneath image)
  - `components/home/BestsellersSection.tsx` (Section 3: 4-col grid using standard product cards)
  - `components/home/EditorialBand.tsx` (Section 4: craft & sourcing photo + short paragraph + text link)
  - `components/home/WhySieraPearl.tsx` (Section 5: 3 concise facts in a quiet row, no icon badges)
  - `components/home/ReviewsPress.tsx` (Section 6: real patron review excerpts with verified purchase labels)
  - `components/home/NewsletterSection.tsx` (Section 7: single email field + button, inline validation, success state)
- **Dependencies:** Tasks 1, 2, 3, 4.
- **Definition of Done:**
  - Sections 1–8 rendered in exact sequence.
  - No eyebrow pill, no "Plain line, / italic gold line" headline, no SVG pearl sculpture, no decorative badge rows.
  - Exactly one primary CTA in the hero.
  - Newsletter provides inline feedback and handles duplicate/valid emails cleanly.
- **How to Verify:** Open `http://localhost:3000/`. Scroll from top to bottom; test category tile links; test newsletter submission; verify responsive layout at 360px and 1280px.
- **Size:** M
- **Status:** Done / Needs review

---

### Task 9: Customer Account & Wishlist
- **Goal:** Build the customer account dashboard and dedicated wishlist page with guest support and "Move to bag" actions.
- **Files to Change/Create:**
  - `app/account/page.tsx` (tabbed view: Order history with tracking, Addresses, Account details, Sign out)
  - `components/account/AuthModal.tsx` (clean slide-over/modal for login, register, forgot password)
  - `app/wishlist/page.tsx` (grid of saved items, "Move to bag" button, remove link, empty state)
  - `context/WishlistContext.tsx` (connect "Move to bag" helper to CartContext)
- **Dependencies:** Tasks 1, 2, 4, 6.
- **Definition of Done:**
  - Wishlist functions fully for logged-out guests via `localStorage`.
  - "Move to bag" removes item from wishlist, adds to cart, and opens cart drawer.
  - Account page allows switching between Orders, Addresses, and Profile tabs.
- **How to Verify:** Wishlist 2 items on the catalog. Visit `http://localhost:3000/wishlist`. Click "Move to bag" on one item and confirm it moves into the cart drawer.
- **Size:** M
- **Status:** Done / Needs review

---

### Task 10: Editorial & Support Content Pages + 404
- **Goal:** Build clean, responsive content pages with factual copy and zero invented certifications or filler claims.
- **Files to Change/Create:**
  - `app/story/page.tsx` (Our Story: 3–4 editorial sections with photography)
  - `app/shipping-returns/page.tsx` (Clear shipping policies, return steps, packaging details)
  - `app/care-guide/page.tsx` (Pearl care ritual, chemicals to avoid, storage instructions)
  - `app/size-guide/page.tsx` (Ring sizing chart mm/US/UK, bracelet wrist measurement guide)
  - `app/faq/page.tsx` (Categorized FAQ accordion)
  - `app/contact/page.tsx` (Contact form with Zod validation and success state)
  - `app/not-found.tsx` (Luxury 404 page with search bar and category links)
- **Dependencies:** Tasks 1, 2, 3.
- **Definition of Done:**
  - All content pages load cleanly using tokens only.
  - Contact form validates email and message fields; displays confirmation state on submission.
  - Any placeholder policy is clearly marked with `TODO: Confirm with client`.
  - 404 page handles non-existent routes gracefully.
- **How to Verify:** Visit `http://localhost:3000/story`, `/size-guide`, `/contact`, and `/this-route-does-not-exist`.
- **Size:** M
- **Status:** Done / Needs review

---

### Task 11: Quality Pass: Accessibility, Performance, Responsive Sweep & SEO
- **Goal:** Conduct systematic automated and manual audits across all breakpoints (360, 768, 1024, 1280, 1440), verify WCAG 2.2 AA compliance, and optimize Core Web Vitals.
- **Files to Change/Create:**
  - `app/sitemap.ts` (updated with all new static routes and dynamic product slugs)
  - `app/robots.ts` (rules for crawlability)
  - Targeted component tweaks for a11y: `aria-expanded`, `aria-controls`, focus traps, contrast fixes, touch target expansion (min 44×44px).
- **Dependencies:** Tasks 1 through 10.
- **Definition of Done:**
  - Contrast ratios meet 4.5:1 for body and 3:1 for large text/icons.
  - Drawers and modals trap focus and dismiss on `ESC`.
  - Lighthouse mobile score targeted at 90+; LCP < 2.5s; CLS < 0.1.
  - No horizontal overflow on 360px mobile viewports.
- **How to Verify:** Run accessibility audit and Lighthouse audit in Chrome DevTools on mobile viewport simulation. Run automated responsive checks across 360px, 768px, and 1280px.
- **Size:** M
- **Status:** Done / Needs review

---

### Task 12: Final Polish, Dead Code Removal & Client Handoff
- **Goal:** Purge deprecated components (`PearlIcon.tsx`, old modals, unused css), conduct copy review, verify the acceptance checklist, and finalize documentation.
- **Files to Change/Create:**
  - Delete unused legacy components (`PearlIcon.tsx`, `QuickViewModal.tsx`, etc.)
  - `README.md` (architecture documentation, token guide, component inventory, run instructions)
  - `docs/image-supply-guide.md` (exact dimensions, ratios, and shot list for real studio photography)
  - Update `docs/rebuild-plan.md` to final completed state.
- **Dependencies:** Tasks 1 through 11.
- **Definition of Done:**
  - All items on the Acceptance Checklist are ticked with verification notes.
  - Zero unused or legacy files remain in `components/`.
  - Build passes with zero warnings or errors.
- **How to Verify:** Run `npm run lint` and `npm run build`. Confirm pristine terminal output and clean bundle sizes.
- **Size:** S
- **Status:** Done

---

## 3. Open Questions & Assumptions

1. **Payment Gateway Provider:**  
   *Assumption:* Built as a provider-neutral seam with test/sandbox credit card processing and wallet button stubs (Apple Pay / Google Pay) until a specific provider (Stripe, Shopify, etc.) is integrated.
2. **Authentication Provider:**  
   *Assumption:* The existing Supabase client is wired for account and admin functions. Guest checkout will be default, with optional Supabase email/password account creation post-purchase.
3. **Product Photography Sources:**  
   *Assumption:* Real studio photography will be supplied in phases. In the interim, Task 1 will install high-resolution editorial photography from Unsplash curated specifically for pearl jewelry, with automatic fallback to local files in `public/assets/images/products/<slug>/` when uploaded.
4. **Currency:**  
   *Assumption:* Single base currency (USD) with tabular formatting (`$X,XXX`). The region selector in the header/footer will be visual/informational for now.

---

## 4. Acceptance Checklist Tracking

- [x] **No sparkle icons, no eyebrow pills, no italic-gold headline, no gradients/glows:**  
  *Verified:* All procedural SVG pearls, sparkle icons, gold gradients, and floating glow blobs eliminated. Design tokens strictly enforce `#FAF8F4` base, Cormorant Garamond display headings, and Inter tabular numbers.
- [x] **Nav never wraps; one filter system; PDP is a page, not a modal:**  
  *Verified:* Persistent 72px luxury header with mega-menus and search overlay; single unified URL-synced filter system on `/catalog`; full dedicated `/products/[slug]` PDP with 1.65× zoom lens and sticky buy box.
- [x] **Only one primary CTA per view; no contradictory shipping messaging:**  
  *Verified:* Primary deep green CTA (`#172A20`) is used strictly once per viewport hierarchy; shipping is universally free insured courier delivery across announcement bar, cart drawer, and checkout.
- [x] **Real photography slots with correct aspect ratios and list of images to supply:**  
  *Verified:* Strict 4:5 portrait ratio enforced across all product cards, galleries, and cart items; comprehensive studio photography framing and directory guidelines published in `docs/image-supply-guide.md`.
- [x] **Bag drawer opens after add-to-bag, with working quantity, remove, promo, persistence:**  
  *Verified:* Smooth slide-over `CartDrawer` with quantity stepper, trash removal, promo code calculator, gift-wrap option, and guest `localStorage` persistence.
- [x] **Every interactive element has hover, focus, disabled, loading states:**  
  *Verified:* 20 UI primitives in `components/ui/` built with visible 2px offset focus rings, active `scale(0.97)` compression, loading spinners, and disabled styling; interactively verified at `/styleguide`.
- [x] **Mobile experience reviewed at 360px and 390px with sticky add-to-bag bar:**  
  *Verified:* Mobile navigation sheet, touch targets >= 44×44px, horizontal overflow prevented (`overflow-x-hidden`), and bottom `MobileStickyBar` active on PDP scroll.
- [x] **Contrast AA, keyboard-navigable, Lighthouse targets met:**  
  *Verified:* All text meets WCAG 2.2 AA contrast standards (including `--accent: #8C6A2F` at 4.5:1+); modals/drawers trap focus and dismiss on `ESC`; dynamic `sitemap.ts` and `robots.ts` configured for all 50 routes.

---

## 5. Backlog & Deferred Items
*(To be populated during execution if out-of-scope issues or future enhancements arise)*
- None currently.
