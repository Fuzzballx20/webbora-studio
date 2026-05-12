import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { fetchProductBySlug, formatMoney, imageUrl } from "@/lib/shop";
import { useCart } from "@/lib/cart";
import { SiteLayout } from "@/components/site/SiteShell";

export const Route = createFileRoute("/shop/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { add } = useCart();

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
  });

  const [variantId, setVariantId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="aspect-[4/5] animate-pulse rounded-md bg-secondary md:aspect-[5/4]" />
        </div>
      </SiteLayout>
    );
  }

  if (!data) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="handwritten text-2xl text-clay">— hmm —</p>
          <h1 className="mt-2 font-serif text-4xl text-cocoa">This piece has wandered off.</h1>
          <Link to="/shop" className="handwritten mt-6 inline-block text-xl text-clay underline decoration-wavy underline-offset-8">
            back to the rack →
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const selected = data.variants.find((v) => v.id === variantId) ?? null;
  const inStockVariants = data.variants.filter((v) => v.stock > 0);
  const allOutOfStock = inStockVariants.length === 0;

  const handleAdd = () => {
    if (!selected) {
      toast("Choose a size first", { description: "Pick the one that feels right." });
      return;
    }
    add(
      {
        variantId: selected.id,
        productId: data.id,
        slug: data.slug,
        title: data.title,
        size: selected.size,
        imagePath: data.image_path,
        unitPriceCents: data.price_cents,
        currency: data.currency,
        maxStock: selected.stock,
      },
      qty,
    );
    toast("Added to your basket", { description: `${data.title} · size ${selected.size}` });
  };

  const buyNow = () => {
    if (!selected) {
      toast("Choose a size first");
      return;
    }
    handleAdd();
    navigate({ to: "/cart" });
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-6 pb-24">
        <Link
          to="/shop"
          className="handwritten inline-flex items-center gap-2 text-lg text-cocoa/70 hover:text-clay"
        >
          <ArrowLeft className="h-4 w-4" /> back to the rack
        </Link>

        <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-16">
          {/* Editorial image */}
          <div className="relative">
            <figure
              className="scrapbook rounded-md"
              style={{ transform: "rotate(-2deg)" }}
            >
              <span className="tape rounded-sm" style={{ top: -10, left: "calc(50% - 45px)", transform: "rotate(3deg)" }} aria-hidden="true" />
              <div className="aspect-[4/5] overflow-hidden rounded-sm">
                <img
                  src={imageUrl(data.image_path)}
                  alt={data.title}
                  width={1024}
                  height={1280}
                  className="h-full w-full object-cover"
                />
              </div>
              {data.tagline && (
                <figcaption className="handwritten mt-3 text-center text-xl text-cocoa/70">
                  {data.tagline}
                </figcaption>
              )}
            </figure>
          </div>

          {/* Details */}
          <div className="space-y-7 md:pt-6">
            <div>
              <p className="handwritten text-xl text-clay">— a new piece —</p>
              <h1 className="mt-2 font-serif text-4xl leading-tight text-cocoa md:text-5xl">
                {data.title}
              </h1>
              <p className="mt-3 text-lg text-cocoa/80">{formatMoney(data.price_cents, data.currency)}</p>
            </div>

            {data.description && (
              <p className="leading-relaxed text-cocoa/75">{data.description}</p>
            )}

            {/* Size selector */}
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <p className="handwritten text-xl text-clay">choose a size</p>
                {selected && (
                  <span className="text-xs text-cocoa/55">
                    {selected.stock <= 2 ? `only ${selected.stock} left` : `${selected.stock} in stock`}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.variants.map((v) => {
                  const out = v.stock <= 0;
                  const active = v.id === variantId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={out}
                      onClick={() => {
                        setVariantId(v.id);
                        setQty(1);
                      }}
                      className={`min-w-14 rounded-full border px-4 py-2 text-sm transition ${
                        active
                          ? "border-cocoa bg-cocoa text-cream"
                          : out
                          ? "border-border/50 text-cocoa/30 line-through"
                          : "border-cocoa/30 bg-cream/60 text-cocoa hover:border-clay hover:text-clay"
                      }`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
              {allOutOfStock && (
                <p className="handwritten mt-3 text-base text-clay">
                  fully spoken for — write to me and I'll make another ✿
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <p className="handwritten mb-3 text-xl text-clay">how many</p>
              <div className="inline-flex items-center rounded-full border border-cocoa/30 bg-cream/60">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-cocoa hover:text-clay"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center text-lg text-cocoa">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(selected?.stock ?? 99, q + 1))}
                  disabled={!selected || qty >= (selected?.stock ?? 0)}
                  className="flex h-11 w-11 items-center justify-center text-cocoa hover:text-clay disabled:opacity-30"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleAdd}
                disabled={allOutOfStock}
                className="rounded-full bg-cocoa px-6 py-3 text-sm text-cream shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-clay disabled:opacity-40 disabled:hover:translate-y-0"
              >
                Add to basket
              </button>
              <button
                type="button"
                onClick={buyNow}
                disabled={allOutOfStock}
                className="rounded-full border border-cocoa/30 bg-cream/60 px-6 py-3 text-sm text-cocoa transition hover:border-clay hover:text-clay disabled:opacity-40"
              >
                Take it home →
              </button>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/70 p-5 text-sm leading-relaxed text-cocoa/70">
              <p className="handwritten text-lg text-clay">— a small note —</p>
              <p className="mt-1">
                Each piece is cut and stitched by hand, so small irregularities are part of the
                charm. Once you place an order I'll write back personally to confirm everything
                and arrange payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
