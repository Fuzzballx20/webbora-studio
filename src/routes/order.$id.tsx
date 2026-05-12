import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteShell";

const orderSearch = z.object({
  name: z.string().optional(),
});

export const Route = createFileRoute("/order/$id")({
  validateSearch: (s) => orderSearch.parse(s),
  component: OrderPage,
  head: () => ({ meta: [{ title: "Order received — Designs by Webbora" }] }),
});

function OrderPage() {
  const { id } = Route.useParams();
  const { name } = Route.useSearch();
  const shortId = id.slice(0, 8);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div
          className="scrapbook mx-auto rounded-md p-8"
          style={{ transform: "rotate(-1.5deg)" }}
        >
          <span className="tape rounded-sm" style={{ top: -10, left: "calc(50% - 45px)", transform: "rotate(2deg)" }} aria-hidden="true" />
          <p className="handwritten text-2xl text-clay">— your request is in —</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-cocoa md:text-5xl">
            Thank you{name ? `, ${name}` : ""}.
          </h1>
          <p className="mt-4 text-cocoa/75">
            I've received your order. I'll write back personally within a day or two to confirm everything,
            arrange payment, and let you know when your pieces will be on their way.
          </p>
          <p className="handwritten mt-6 text-lg text-cocoa/55">
            order no. <span className="text-clay">#{shortId}</span>
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className="rounded-full bg-cocoa px-6 py-3 text-sm text-cream shadow-[var(--shadow-soft)] hover:bg-clay"
          >
            Keep wandering the rack
          </Link>
          <Link
            to="/"
            className="rounded-full border border-cocoa/30 bg-cream/60 px-6 py-3 text-sm text-cocoa hover:border-clay hover:text-clay"
          >
            Back home
          </Link>
        </div>

        <p className="handwritten mt-12 text-xl text-cocoa/60">
          with love, from my studio to your wardrobe ✿
        </p>
      </div>
    </SiteLayout>
  );
}
