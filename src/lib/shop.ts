import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  price_cents: number;
  currency: string;
  image_path: string | null;
  category: string | null;
  is_featured: boolean;
  position: number;
};

export type Variant = {
  id: string;
  product_id: string;
  size: string;
  stock: number;
  position: number;
};

export type ProductWithVariants = Product & { variants: Variant[] };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

export function imageUrl(path: string | null | undefined): string {
  if (!path) return "";
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
}

export function formatMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export async function fetchProducts(opts?: { featuredOnly?: boolean }): Promise<Product[]> {
  let q = supabase.from("products").select("*").eq("is_active", true).order("position");
  if (opts?.featuredOnly) q = q.eq("is_featured", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function fetchProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  if (!product) return null;

  const { data: variants, error: vErr } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", product.id)
    .order("position");
  if (vErr) throw vErr;

  return { ...(product as Product), variants: (variants ?? []) as Variant[] };
}
