# Product Photo Guide — Siera Pearl

The site is already wired to use real photos automatically. Nothing to configure in code — just drop files into the right folder.

## Where photos go

```
public/assets/images/products/<product-folder>/01.jpg
                                          02.jpg
                                          03.jpg
                                          ...
```

Each product already has its own empty folder waiting under `public/assets/images/products/`. Find the folder name for a product in the table below.

## Naming rule (the only rule)

- Name files **01, 02, 03…** in the order you want them to appear.
- **01** is always the hero/main photo — it is what shows on the shop grid, category pages, and the top of the quick-view gallery.
- **02 onward** are the extra angles/detail shots shown as thumbnails in quick view. **02** also becomes the hover-swap image on the shop grid (hovering a product card previews it).
- Use any of these formats: `.jpg`, `.jpeg`, `.png`, `.webp`. You don’t need to pick one format for the whole catalog — the site checks for all four automatically.
- Keep the numbering sequential with no gaps (01, 02, 03 — not 01, 03). The site stops looking as soon as it hits a missing number, up to a max of 8 photos per product.
- Recommended: square (1:1) images, at least 1200×1200px, compressed (JPG ~80% quality or WebP) so the site stays fast.

## What happens automatically

- **No photos yet** → the product shows its current placeholder icon. The site works fine either way — nothing breaks while you’re still shooting/editing photos.
- **`01` exists** → that product instantly switches to the real photo, on every page, no code change, no rebuild needed for local/dev preview.
- **`02` exists** → hovering the product card on the shop grid swaps to it; it also appears as the second thumbnail in quick view.
- You can add photos gradually, a few products at a time — each product upgrades independently as soon as its own `01` file is added.

## Example

For **Classic Akoya Strand** (folder `01-classic-akoya-strand`):

```
public/assets/images/products/01-classic-akoya-strand/01.jpg   ← hero shot (used everywhere as default)
public/assets/images/products/01-classic-akoya-strand/02.jpg   ← alternate angle (hover-swap + thumbnail)
public/assets/images/products/01-classic-akoya-strand/03.jpg   ← close-up / detail shot (thumbnail)
public/assets/images/products/01-classic-akoya-strand/04.webp  ← lifestyle/in-use shot (thumbnail)
```

## Full folder map (all 30 products)

| ID | Folder | Product |
|----|--------|---------|
| 1 | `01-classic-akoya-strand` | Classic Akoya Strand |
| 2 | `02-golden-solitaire-pendant` | Golden Solitaire Pendant |
| 3 | `03-tahitian-lariat` | Tahitian Lariat |
| 4 | `04-baroque-freshwater-choker` | Baroque Freshwater Choker |
| 5 | `05-rose-gold-solitaire-drop` | Rose Gold Solitaire Drop |
| 6 | `06-double-strand-opera` | Double Strand Opera |
| 7 | `07-keshi-y-necklace` | Keshi Y-Necklace |
| 8 | `08-classic-akoya-studs` | Classic Akoya Studs |
| 9 | `09-golden-south-sea-drops` | Golden South Sea Drops |
| 10 | `10-tahitian-halo-studs` | Tahitian Halo Studs |
| 11 | `11-freshwater-threaders` | Freshwater Threaders |
| 12 | `12-rose-gold-pearl-huggies` | Rose Gold Pearl Huggies |
| 13 | `13-baroque-ear-climbers` | Baroque Ear Climbers |
| 14 | `14-south-sea-pav-drops` | South Sea Pavé Drops |
| 15 | `15-akoya-tennis-bracelet` | Akoya Tennis Bracelet |
| 16 | `16-golden-south-sea-bangle` | Golden South Sea Bangle |
| 17 | `17-tahitian-toggle-bracelet` | Tahitian Toggle Bracelet |
| 18 | `18-freshwater-wrap-bracelet` | Freshwater Wrap Bracelet |
| 19 | `19-rose-gold-pearl-charm-chain` | Rose Gold Pearl Charm Chain |
| 20 | `20-keshi-cluster-bracelet` | Keshi Cluster Bracelet |
| 21 | `21-classic-akoya-solitaire` | Classic Akoya Solitaire |
| 22 | `22-rose-gold-pearl-ring` | Rose Gold Pearl Ring |
| 23 | `23-tahitian-statement-ring` | Tahitian Statement Ring |
| 24 | `24-freshwater-stack-ring` | Freshwater Stack Ring |
| 25 | `25-south-sea-halo-ring` | South Sea Halo Ring |
| 26 | `26-gold-signet-with-pearl` | Gold Signet with Pearl |
| 27 | `27-bridal-trio-set` | Bridal Trio Set |
| 28 | `28-akoya-wedding-drops` | Akoya Wedding Drops |
| 29 | `29-heirloom-three-strand-necklace` | Heirloom Three-Strand Necklace |
| 30 | `30-grand-south-sea-set` | Grand South Sea Set |

## If you add a new product later

1. Add the product to the `PRODUCTS` array in `js/main.js` (copy an existing entry as a template).
2. The site auto-generates its folder name (slug) from the product’s `id` and `name` — you can see the exact pattern in the table above (`01` + hyphenated lowercase name).
3. Create that folder under `public/assets/images/products/` and drop in `01.jpg`, `02.jpg`, etc.
