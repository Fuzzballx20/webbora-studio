import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatMoney, imageUrl } from "@/lib/shop";
import { SiteLayout } from "@/components/site/SiteShell";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Your basket — Designs by Webbora" }] }),
});

function CartPage() {
  const { items, subtotalCents, currency, setQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="handwritten text-2xl text-clay">— your basket —</p>
          <h1 className="mt-2 font-serif text-4xl text-cocoa">Quiet in here.</h1>
          <p className="mt-3 text-cocoa/70">Wander the rack — there's bound to be something that catches your eye.</p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-full bg-cocoa px-6 py-3 text-sm text-cream shadow-[var(--shadow-soft)] hover:bg-clay"
          >
            Browse pieces →
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <p className="handwritten text-2xl text-clay">— your basket —</p>
        <h1 className="mt-2 font-serif text-4xl text-cocoa md:text-5xl">A few pieces, gathered.</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <ul className="space-y-5">
            {items.map((it, i) => (
              <li
                key={it.variantId}
                className="scrapbook flex gap-4 rounded-md p-4 sm:gap-5 sm:p-5"
                style={{ transform: `rotate(${i % 2 === 0 ? -0.4 : 0.5}deg)` }}
              >
                <Link to="/shop/$slug" params={{ slug: it.slug }} className="shrink-0">
                  <div className="h-24 w-24 overflow-hidden rounded-sm sm:h-28 sm:w-28">
                    <img
                      src={imageUrl(it.imagePath)}
                      alt={it.title}
                      width={224}
                      height={224}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to="/shop/$slug" params={{ slug: it.slug }} className="font-serif text-xl text-cocoa hover:text-clay">
                        {it.title}
                      </Link>
                      <p className="handwritten text-base text-cocoa/55">size {it.size}</p>
                    </div>
                    <p className="text-cocoa">{formatMoney(it.unitPriceCents * it.quantity, it.currency)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-full border border-cocoa/25 bg-cream/60">
                      <button
                        type="button"
                        aria-label="Decrease"
                        onClick={() => setQty(it.variantId, it.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center text-cocoa hover:text-clay"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-cocoa">{it.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase"
                        onClick={() => setQty(it.variantId, it.quantity + 1)}
                        disabled={it.quantity >= it.maxStock}
                        className="flex h-9 w-9 items-center justify-center text-cocoa hover:text-clay disabled:opacity-30"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(it.variantId)}
                      className="handwritten inline-flex items-center gap-1 text-base text-cocoa/55 hover:text-clay"
                    >
                      <Trash2 className="h-4 w-4" /> remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <aside className="paper-texture sticky top-6 h-fit rounded-3xl border border-border/60 p-6 shadow-[var(--shadow-soft)]">
            <p className="handwritten text-xl text-clay">— a quick total —</p>
            <dl className="mt-4 space-y-2 text-sm text-cocoa/80">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatMoney(subtotalCents, currency)}</dd>
              </div>
              <div className="flex justify-between text-cocoa/55">
                <dt>Shipping</dt>
                <dd className="handwritten text-base">calculated by hand</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-border/60 pt-4">
              <span className="font-serif text-xl text-cocoa">Total</span>
              <span className="font-serif text-2xl text-cocoa">{formatMoney(subtotalCents, currency)}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-6 flex w-full items-center justify-center rounded-full bg-cocoa px-6 py-3 text-sm text-cream shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-clay"
            >
              Send my order request →
            </Link>
            <p className="handwritten mt-4 text-center text-base text-cocoa/55">
              I'll write back personally to confirm everything ✿
            </p>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
