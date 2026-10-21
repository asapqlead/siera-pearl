# Siera Pearl — Studio Photography & Asset Supply Guide

This guide specifies the technical standards, framing conventions, aspect ratios, and folder conventions required for delivering real studio photography to replace temporary editorial fallbacks.

---

## 1. Technical Image Specifications

| Attribute | Specification | Notes |
| :--- | :--- | :--- |
| **Aspect Ratio** | **4:5 Portrait** (Mandatory for all products & categories) | e.g. 1200×1500px or 1600×2000px. |
| **Minimum Resolution** | 1200 × 1500 pixels (72–150 DPI RGB) | Retina display / hover zoom requires min 1200px width. |
| **Hero Image Ratio** | **16:9 / 16:10 Wide** (2400 × 1350px or 2560 × 1440px) | For full-bleed homepage hero. |
| **File Format** | `.jpg`, `.jpeg`, or `.webp` (82–88% quality) | Progressive JPEG or optimized WebP. |
| **Color Space** | **sRGB** (IEC61966-2.1) | Standard for accurate digital color reproduction. |
| **Maximum File Size** | < 350 KB per image | Optimized for Core Web Vitals (LCP < 2.5s). |

---

## 2. Background & Lighting Conventions

- **Background Canvas:** Warm Ivory (`#FAF8F4`) or Pale Natural Linen (`#F3EFE8`). Avoid clinical 100% pure blue-white (`#FFFFFF`) cutouts or harsh neon backdrops.
- **Surface & Props:** Honed warm travertine, matte ivory ceramic, raw unbleached linen, or soft ambient shadows. Avoid high-gloss mirrors, acrylic stands, or plastic props.
- **Lighting Technique:**
  - Soft, diffused natural north daylight or 5500K balanced studio strobes through 120cm+ octaboxes.
  - Highlights should reveal the **orient** (rainbow iridescence) and specular reflection of the pearl skin without blown-out clipping.
  - 18k solid gold bezels and clasps should display warm, authentic yellow, rose, or white gold tones without artificial oversaturation.

---

## 3. Shot List per SKU (3 Essential Angles)

Every product in the catalog supports a 3-photo slot in [`lib/images.ts`](file:///c:/Code/siera_pearl/lib/images.ts):

### Shot 1: Primary Studio Still (Required)
- **Role:** Front catalog tile & primary PDP gallery photo.
- **Framing:** Centered, elegant lay-flat or gentle pedestal drape.
- **Subject Coverage:** 70–80% of vertical frame height.
- **Filename:** `01.jpg`

### Shot 2: Macro Orient & Craft Detail (Required)
- **Role:** Desktop hover cross-fade & second PDP gallery zoom.
- **Framing:** Macro 1:1 or 2:1 close-up focusing on pearl nacre skin, clasp mechanism, prongs, or bezel setting.
- **Filename:** `02.jpg`

### Shot 3: On-Model Lifestyle Crop (Recommended)
- **Role:** Third PDP gallery photo demonstrating scale, skin drape, and wearability.
- **Framing:** Close, intimate crop on neck/ear/wrist/hand in morning light.
- **Filename:** `03.jpg`

---

## 4. Local File Drop & Automatic Priority

The Siera Pearl image registry ([`lib/images.ts`](file:///c:/Code/siera_pearl/lib/images.ts)) is engineered with automatic local file discovery:

```
public/
  assets/
    images/
      products/
        01-classic-akoya-strand/
          01.jpg   <-- Primary studio shot (4:5)
          02.jpg   <-- Macro detail / hover shot (4:5)
          03.jpg   <-- On-model lifestyle crop (4:5)
        02-golden-solitaire-pendant/
          01.jpg
          02.jpg
        ...
      categories/
        necklaces.jpg (1200x1500px, 4:5)
        earrings.jpg  (1200x1500px, 4:5)
        bracelets.jpg (1200x1500px, 4:5)
        rings.jpg     (1200x1500px, 4:5)
        bridal.jpg    (1200x1500px, 4:5)
      hero/
        hero-editorial.jpg (2400x1350px)
```

> [!TIP]
> **Zero Code Changes Needed:** When you drop real photography into `public/assets/images/products/<slug>/01.jpg`, the storefront will prioritize your local studio photographs over the fallback registry.

---

## 5. SKU Directory Reference (30 Active Pieces)

| ID | Slug | Product Name | Category | Primary Pearl |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `01-classic-akoya-strand` | Classic Akoya Pearl Strand | Necklaces | Akoya (7.0–7.5mm) |
| **02** | `02-golden-solitaire-pendant` | Golden Solitaire Pendant | Necklaces | South Sea (10.0mm) |
| **03** | `03-tahitian-lariat` | Tahitian Peacock Lariat | Necklaces | Tahitian (9.5mm) |
| **04** | `04-freshwater-collar` | Freshwater Keshi Collar | Necklaces | Keshi (6.0mm) |
| **05** | `05-floating-pearl-choker` | Floating Pearl Choker | Necklaces | Akoya (8.0mm) |
| **06** | `06-baroque-opera-rope` | Baroque South Sea Rope | Necklaces | South Sea (11.0mm) |
| **07** | `07-akoya-studs` | Classic Akoya Pearl Studs | Earrings | Akoya (8.0mm) |
| **08** | `08-tahitian-drops` | Tahitian Pearl Drop Earrings | Earrings | Tahitian (10.0mm) |
| **09** | `09-south-sea-huggie` | South Sea Pearl Huggies | Earrings | South Sea (9.0mm) |
| **10** | `10-freshwater-threaders` | Freshwater Pearl Threaders | Earrings | Freshwater (7.0mm) |
| **11** | `11-baroque-chandelier` | Baroque Pearl Chandeliers | Earrings | South Sea (12.0mm) |
| **12** | `12-keshi-climbers` | Keshi Pearl Ear Climbers | Earrings | Keshi (5.5mm) |
| **13** | `13-akoya-tennis-bracelet` | Akoya Pearl Tennis Bracelet | Bracelets | Akoya (6.5mm) |
| **14** | `14-south-sea-bangle` | South Sea Solitaire Bangle | Bracelets | South Sea (11.0mm) |
| **15** | `15-tahitian-charm-bracelet` | Tahitian Pearl Charm Bracelet | Bracelets | Tahitian (9.0mm) |
| **16** | `16-freshwater-cuff` | Freshwater Pearl Wire Cuff | Bracelets | Freshwater (7.5mm) |
| **17** | `17-baroque-chain-bracelet` | Baroque Pearl Chain Bracelet | Bracelets | South Sea (10.0mm) |
| **18** | `18-keshi-station-bracelet` | Keshi Station Bracelet | Bracelets | Keshi (6.0mm) |
| **19** | `19-akoya-solitaire-ring` | Classic Akoya Solitaire Ring | Rings | Akoya (8.5mm) |
| **20** | `20-south-sea-cocktail-ring` | South Sea Cocktail Ring | Rings | South Sea (13.0mm) |
| **21** | `21-tahitian-bypass-ring` | Tahitian Bypass Ring | Rings | Tahitian (10.0mm) |
| **22** | `22-freshwater-eternity-band` | Freshwater Pearl Eternity Band | Rings | Freshwater (4.0mm) |
| **23** | `23-baroque-open-ring` | Baroque Pearl Open Ring | Rings | South Sea (11.0mm) |
| **24** | `24-keshi-cluster-ring` | Keshi Pearl Cluster Ring | Rings | Keshi (5.0mm) |
| **25** | `25-bridal-akoya-suite` | Royal Akoya Bridal Suite | Bridal | Akoya (7.5–8.0mm) |
| **26** | `26-south-sea-tiara` | South Sea Pearl Hairband | Bridal | South Sea (9.0mm) |
| **27** | `27-tahitian-evening-suite` | Tahitian Twilight Suite | Bridal | Tahitian (10.5mm) |
| **28** | `28-freshwater-bridal-drop` | Freshwater Veil Drops | Bridal | Freshwater (8.0mm) |
| **29** | `29-baroque-bridal-choker` | Baroque Silk Ribbon Choker | Bridal | South Sea (12.5mm) |
| **30** | `30-keshi-bridal-pins` | Keshi Pearl Hairpin Set | Bridal | Keshi (5.0mm) |
