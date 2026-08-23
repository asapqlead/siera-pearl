-- ============================================================
-- Siera Pearl — Supabase schema for the product management page
-- Run this once in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. PRODUCTS TABLE ------------------------------------------------
create table if not exists public.products (
  id           bigint generated always as identity primary key,
  slug         text unique not null,          -- e.g. "01-classic-akoya-strand", used for photo folder
  cat          text not null,                  -- Necklaces / Earrings / Bracelets / Rings / Bridal
  name         text not null,
  metal        text not null,                  -- Yellow Gold / Rose Gold / White Gold
  pearl        text not null,                  -- Akoya / South Sea / Tahitian / Freshwater / Keshi
  price        numeric(10,2) not null,
  was          numeric(10,2),                  -- original price if on sale, else null
  description  text,
  badge        text,                           -- Bestseller / Sale / New / null
  rating       int check (rating between 1 and 5) default 5,
  in_stock     boolean not null default true,
  stock_qty    int not null default 0,
  photos       jsonb not null default '[]',    -- array of public photo URLs, in display order
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- keep updated_at fresh on every edit
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- 2. ROW LEVEL SECURITY ---------------------------------------------
alter table public.products enable row level security;

-- anyone (incl. the storefront, using the anon key) can read products
create policy "Public can read products"
  on public.products for select
  to anon, authenticated
  using (true);

-- only logged-in users (the stock controller) can add/edit/delete
create policy "Authenticated can insert products"
  on public.products for insert
  to authenticated
  with check (true);

create policy "Authenticated can update products"
  on public.products for update
  to authenticated
  using (true) with check (true);

create policy "Authenticated can delete products"
  on public.products for delete
  to authenticated
  using (true);

-- 3. PHOTO STORAGE BUCKET -------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

create policy "Public can view product photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-photos');

create policy "Authenticated can upload product photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-photos');

create policy "Authenticated can update product photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-photos');

create policy "Authenticated can delete product photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-photos');

-- 4. SEED DATA — migrates the 30 existing products from js/main.js --
insert into public.products
  (slug, cat, name, metal, pearl, price, was, description, badge, rating, in_stock, stock_qty, sort_order)
values
('01-classic-akoya-strand','Necklaces','Classic Akoya Strand','White Gold','Akoya',1280,null,'A single strand of 34 hand-matched Akoya pearls, each prized for mirror-bright lustre, finished with an 18k white gold ball clasp.','Bestseller',5,true,12,1),
('02-golden-solitaire-pendant','Necklaces','Golden Solitaire Pendant','Yellow Gold','South Sea',640,780,'One golden South Sea pearl suspended from a delicate 18k gold chain — quietly luminous, worn alone or layered.','Sale',5,true,8,2),
('03-tahitian-lariat','Necklaces','Tahitian Lariat','Yellow Gold','Tahitian',1450,null,'A fluid lariat of graduated Tahitian pearls in peacock and aubergine overtones, worn knotted or draped long.',null,4,true,5,3),
('04-baroque-freshwater-choker','Necklaces','Baroque Freshwater Choker','Rose Gold','Freshwater',410,null,'Irregular baroque freshwater pearls in soft blush tones, strung close to the collarbone for a modern silhouette.','New',4,true,10,4),
('05-rose-gold-solitaire-drop','Necklaces','Rose Gold Solitaire Drop','Rose Gold','Freshwater',290,null,'A single teardrop freshwater pearl in a rose gold bezel, on a fine cable chain — an everyday layering piece.',null,5,true,15,5),
('06-double-strand-opera','Necklaces','Double Strand Opera','White Gold','Akoya',2100,null,'Two strands of Akoya pearls at opera length, designed to be worn long or wrapped into a shorter double row.',null,5,false,0,6),
('07-keshi-y-necklace','Necklaces','Keshi Y-Necklace','Yellow Gold','Keshi',520,null,'Petal-shaped keshi pearls scattered along a fine gold Y-chain, catching light with every irregular facet.',null,4,true,7,7),
('08-classic-akoya-studs','Earrings','Classic Akoya Studs','White Gold','Akoya',340,null,'Round Akoya studs in 18k white gold — the quiet foundation of any pearl wardrobe, from desk to dinner.','Bestseller',5,true,20,8),
('09-golden-south-sea-drops','Earrings','Golden South Sea Drops','Yellow Gold','South Sea',890,null,'Golden South Sea pearls suspended from polished gold wires, moving gently with every turn of the head.',null,5,true,6,9),
('10-tahitian-halo-studs','Earrings','Tahitian Halo Studs','White Gold','Tahitian',760,920,'A dark Tahitian pearl ringed in a fine pavé halo, for evenings that call for a little more shimmer.','Sale',5,true,4,10),
('11-freshwater-threaders','Earrings','Freshwater Threaders','Rose Gold','Freshwater',210,null,'Long chain threaders finished with a single freshwater pearl at each end — light enough to forget you''re wearing them.','New',4,true,18,11),
('12-rose-gold-pearl-huggies','Earrings','Rose Gold Pearl Huggies','Rose Gold','Freshwater',245,null,'Petite huggie hoops in rose gold, each set with a small freshwater pearl for everyday wear.',null,4,true,14,12),
('13-baroque-ear-climbers','Earrings','Baroque Ear Climbers','Yellow Gold','Keshi',395,null,'Sculptural climbers scattered with keshi pearls, tracing the curve of the ear in gold.',null,5,true,9,13),
('14-south-sea-pav-drops','Earrings','South Sea Pavé Drops','White Gold','South Sea',1340,null,'A statement drop pairing a golden South Sea pearl with a pavé-set gold cap — for the room-stopping occasion.',null,5,false,0,14),
('15-akoya-tennis-bracelet','Bracelets','Akoya Tennis Bracelet','White Gold','Akoya',980,null,'Uniform Akoya pearls set in a flexible line, worn solo or stacked with metal bangles.',null,5,true,7,15),
('16-golden-south-sea-bangle','Bracelets','Golden South Sea Bangle','Yellow Gold','South Sea',1120,null,'A solid gold bangle centered on a single golden South Sea pearl, substantial on the wrist.','Bestseller',5,true,5,16),
('17-tahitian-toggle-bracelet','Bracelets','Tahitian Toggle Bracelet','Yellow Gold','Tahitian',670,790,'Dark Tahitian pearls linked with a hand-finished gold toggle clasp designed to be seen, not hidden.','Sale',4,true,6,17),
('18-freshwater-wrap-bracelet','Bracelets','Freshwater Wrap Bracelet','Rose Gold','Freshwater',180,null,'A double-wrap of small freshwater pearls on silk cord with a rose gold clasp — casual, layerable.','New',4,true,22,18),
('19-rose-gold-pearl-charm-chain','Bracelets','Rose Gold Pearl Charm Chain','Rose Gold','Freshwater',295,null,'A fine rose gold chain bracelet finished with a single dangling pearl charm.',null,4,true,11,19),
('20-keshi-cluster-bracelet','Bracelets','Keshi Cluster Bracelet','Yellow Gold','Keshi',430,null,'Clustered keshi pearls in varied sizes on a gold chain — irregular, textural, one of a kind.',null,5,true,8,20),
('21-classic-akoya-solitaire','Rings','Classic Akoya Solitaire','White Gold','Akoya',390,null,'A single Akoya pearl set high on a polished white gold band — timeless, quietly luxe.','Bestseller',5,true,16,21),
('22-rose-gold-pearl-ring','Rings','Rose Gold Pearl Ring','Rose Gold','Freshwater',225,null,'A freshwater pearl set in a slim rose gold band, made for stacking with your everyday rings.',null,4,true,19,22),
('23-tahitian-statement-ring','Rings','Tahitian Statement Ring','Yellow Gold','Tahitian',820,null,'A large Tahitian pearl set in a sculpted gold band — the ring that starts the conversation.',null,5,true,4,23),
('24-freshwater-stack-ring','Rings','Freshwater Stack Ring','Yellow Gold','Freshwater',165,195,'A thin gold band with a single small freshwater pearl, designed to be worn three at a time.','Sale',4,true,25,24),
('25-south-sea-halo-ring','Rings','South Sea Halo Ring','White Gold','South Sea',1560,null,'A golden South Sea pearl framed in a diamond-set halo, for engagements that break tradition.',null,5,true,3,25),
('26-gold-signet-with-pearl','Rings','Gold Signet with Pearl','Yellow Gold','Keshi',310,null,'A solid signet silhouette set with a single keshi pearl in place of an engraved crest.','New',4,true,10,26),
('27-bridal-trio-set','Bridal','Bridal Trio Set','White Gold','Akoya',2450,null,'Matching necklace, earrings, and bracelet in Akoya pearls and white gold — a complete bridal look in one box.','Bestseller',5,true,4,27),
('28-akoya-wedding-drops','Bridal','Akoya Wedding Drops','White Gold','Akoya',560,null,'Understated Akoya drop earrings designed to catch light under a veil without competing with it.',null,5,true,6,28),
('29-heirloom-three-strand-necklace','Bridal','Heirloom Three-Strand Necklace','Yellow Gold','Akoya',3200,null,'Three graduated strands of Akoya pearls on a gold clasp, designed as a piece to be passed down.',null,5,false,0,29),
('30-grand-south-sea-set','Bridal','Grand South Sea Set','Yellow Gold','South Sea',4200,4800,'Necklace and earring set in golden South Sea pearls — the grandest expression of the Siera atelier.','Sale',5,true,2,30)
on conflict (slug) do nothing;
