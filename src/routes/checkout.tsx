import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatMoney } from "@/lib/shop";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteShell";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout — Designs by Webbora" }] }),
});

const checkoutSchema = z.object({
  customer_name: z.string().trim().min(1, "Please tell me your name").max(120),
  customer_email: z.string().trim().email("That email looks off").max(255),
  customer_phone: z.string().trim().max(40).optional().or(z.literal("")),
  shipping_address: z.string().trim().min(5, "I'll need a posting address").max(600),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

function CheckoutPage() {
  const { items, subtotalCents, currency, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0 && !submitting) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <p className="handwritten text-2xl text-clay">— nothing to send —</p>
          <h1 className="mt-2 font-serif text-3xl text-cocoa">Your basket is empty.</h1>
          <Link to="/shop" className="handwritten mt-6 inline-block text-xl text-clay underline decoration-wavy underline-offset-8">
            wander the rack →
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = checkoutSchema.safeParse({
      customer_name: fd.get("customer_name"),
      customer_email: fd.get("customer_email"),
      customer_phone: fd.get("customer_phone") || "",
      shipping_address: fd.get("shipping_address"),
      notes: fd.get("notes") || "",
    });

    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          customer_name: parsed.data.customer_name,
          customer_email: parsed.data.customer_email,
          customer_phone: parsed.data.customer_phone || null,
          shipping_address: parsed.data.shipping_address,
          notes: parsed.data.notes || null,
          subtotal_cents: subtotalCents,
          currency,
        })
        .select("id")
        .single();

      if (error || !order) throw error ?? new Error("Order failed");

      const { error: itemsErr } = await supabase.from("order_items").insert(
        items.map((it) => ({
          order_id: order.id,
          product_id: it.productId,
          variant_id: it.variantId,
          product_title: it.title,
          size: it.size,
          unit_price_cents: it.unitPriceCents,
          quantity: it.quantity,
        })),
      );
      if (itemsErr) throw itemsErr;

      clear();
      navigate({
        to: "/order/$id",
        params: { id: order.id },
        search: { name: parsed.data.customer_name },
      });
    } catch (err) {
      console.error(err);
      toast("Something went wrong", {
        description: "Please try again, or write to hello@designsbywebbora.com.",
      });
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <p className="handwritten text-2xl text-clay">— almost there —</p>
        <h1 className="mt-2 font-serif text-4xl text-cocoa md:text-5xl">A few details, then I'll write back.</h1>
        <p className="mt-3 max-w-xl text-cocoa/70">
          This isn't a card payment — once you send your request I'll reply personally to confirm everything and arrange payment & shipping.
        </p>

        <form onSubmit={onSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-5">
            <Field label="Your name" name="customer_name" error={errors.customer_name} required autoComplete="name" />
            <Field label="Email" name="customer_email" type="email" error={errors.customer_email} required autoComplete="email" />
            <Field label="Phone or WhatsApp (optional)" name="customer_phone" type="tel" error={errors.customer_phone} autoComplete="tel" />
            <Field
              label="Shipping address"
              name="shipping_address"
              error={errors.shipping_address}
              required
              textarea
              rows={3}
              autoComplete="street-address"
            />
            <Field
              label="A note for Webbora (optional)"
              name="notes"
              error={errors.notes}
              textarea
              rows={3}
              placeholder="Anything I should know — fit preferences, gift wrapping, special timing…"
            />
          </div>

          <aside className="paper-texture h-fit rounded-3xl border border-border/60 p-6 shadow-[var(--shadow-soft)] lg:sticky lg:top-6">
            <p className="handwritten text-xl text-clay">— your pieces —</p>
            <ul className="mt-4 space-y-3 text-sm">
              {items.map((it) => (
                <li key={it.variantId} className="flex items-start justify-between gap-3 text-cocoa/80">
                  <div>
                    <p className="text-cocoa">{it.title}</p>
                    <p className="handwritten text-base text-cocoa/55">size {it.size} · ×{it.quantity}</p>
                  </div>
                  <span>{formatMoney(it.unitPriceCents * it.quantity, it.currency)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-baseline justify-between border-t border-border/60 pt-4">
              <span className="font-serif text-xl text-cocoa">Total</span>
              <span className="font-serif text-2xl text-cocoa">{formatMoney(subtotalCents, currency)}</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center rounded-full bg-cocoa px-6 py-3 text-sm text-cream shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-clay disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send my order request →"}
            </button>
            <p className="handwritten mt-4 text-center text-base text-cocoa/55">
              with love, from my studio ✿
            </p>
          </aside>
        </form>
      </div>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  error,
  textarea,
  rows,
  type = "text",
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  error?: string;
  textarea?: boolean;
  rows?: number;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  const base =
    "w-full rounded-2xl border border-border/70 bg-card/80 px-4 py-3 text-cocoa shadow-[var(--shadow-soft)] outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/20";
  return (
    <label className="block">
      <span className="handwritten mb-1 block text-lg text-clay">{label}</span>
      {textarea ? (
        <textarea name={name} rows={rows} required={required} placeholder={placeholder} autoComplete={autoComplete} className={base} />
      ) : (
        <input name={name} type={type} required={required} placeholder={placeholder} autoComplete={autoComplete} className={base} />
      )}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
