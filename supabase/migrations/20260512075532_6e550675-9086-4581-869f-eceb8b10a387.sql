-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  tagline text,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'USD',
  image_path text,
  category text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  stock integer not null default 0 check (stock >= 0),
  sku text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, size)
);

create index idx_variants_product on public.product_variants(product_id);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address text not null,
  notes text,
  subtotal_cents integer not null check (subtotal_cents >= 0),
  currency text not null default 'USD',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_title text not null,
  size text,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index idx_order_items_order on public.order_items(order_id);

-- Enable RLS
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public read for active products
create policy "Active products are viewable by everyone"
  on public.products for select
  using (is_active = true);

create policy "Variants of active products are viewable by everyone"
  on public.product_variants for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_variants.product_id and p.is_active = true
    )
  );

-- Public insert for orders (order request flow, no auth)
create policy "Anyone can create an order"
  on public.orders for insert
  with check (true);

create policy "Anyone can add items to a freshly created order"
  on public.order_items for insert
  with check (true);

-- No public select on orders / order_items — they remain private.

-- Storage bucket for product images (public read)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read access to product images"
  on storage.objects for select
  using (bucket_id = 'product-images');
