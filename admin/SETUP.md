# Product Manager — Setup Guide

This connects the new `/admin` page to Supabase so your stock controller can add,
edit, delete, and re-photo products without touching code.

## 1. Create a Supabase project
1. Go to https://supabase.com → sign up / log in → **New project**.
2. Pick a name (e.g. `siera-pearl`), a database password (save it somewhere safe),
   and a region close to you. Free tier is enough for this catalog size.

## 2. Run the schema
1. In your project, open **SQL Editor** → **New query**.
2. Paste in the full contents of `supabase/schema.sql` (in the project root) and click **Run**.
   This creates the `products` table, sets permissions so the storefront can read
   products but only logged-in staff can edit them, creates the `product-photos`
   storage bucket, and imports your existing 30 products.

## 3. Get your API keys
1. Go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon / public** key (NOT the `service_role` key).
3. Copy `.env.example` to `.env` in the project root and paste them in:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

## 4. Create a login for the stock controller
1. Go to **Authentication → Users → Add user**.
2. Enter their email and a temporary password (or use "send invite email" if you've
   set up an email provider). Untick "Auto Confirm" only if you want them to verify
   by email first — for a quick start, leave auto-confirm on.
3. That's it — no extra role setup needed. Anyone who logs in through `/admin` can
   manage the full catalog; anyone not logged in only sees the read-only storefront.
4. To add more staff later, or to revoke someone's access, manage it from this same
   Users list — no code changes required.

## 5. Open the admin page
- Locally: run the site (`npm run dev`) and visit `/admin/index.html`.
- Once deployed: visit `yourdomain.com/admin/index.html`.
- Bookmark it somewhere only staff will find — it's password-protected, but it's
  not linked from the public site.

## 6. (Optional) Point the storefront at the same data
Right now `js/main.js` still uses its own hardcoded product list, so the live
storefront won't reflect admin edits yet. When you're ready to connect them,
say so and the fetch can be swapped in — same table, same photos, one source
of truth for both the shop and the admin page.

## Notes
- Photos are uploaded to a public Supabase Storage bucket called `product-photos`.
  Each product's photos live under a folder named after its **slug** — keep the
  slug field stable once set, since it's just an organizational label now (the
  storefront's old folder-convention lookup no longer applies once you're on
  step 6 above).
- If you ever need to change someone's password, or remove their access, do it
  from **Authentication → Users** in the Supabase dashboard.
