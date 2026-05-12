import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, formatMoney, imageUrl, type Product } from "@/lib/shop";
import { SiteLayout } from "@/components/site/SiteShell";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop — Designs by Webbora" },
      { name: "description", content: "Tiny batches of handmade clothing, often one of one. Browse the current rack." },
      { property: "og:title", content: "Shop — Designs by Webbora" },
      { property: "og:description", content: "Tiny batches of handmade clothing, often one of one." },
    ],
  }),
});

const ROTATIONS = [-3, 2, -1, 3, -2, 1, -2.5, 1.5];

function ShopPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  return (
    <SiteLayout>
      <section className="px-6 pt-4 pb-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <p className="handwritten text-2xl text-clay">— the rack —</p>
          <h1 className="mt-2 max-w-3xl font-serif text-5xl leading-[1.05] text-cocoa md:text-6xl">
            Everything currently <span className="italic text-clay wavy">on the rack</span>.
          </h1>
          <p className="mt-4 max-w-xl text-cocoa/70">
            New pieces appear when they're finished — sometimes a few a week, sometimes one a month.
            If something's sold out, write to me and I'll often make it again.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <SkeletonGrid />
          ) : (
            <ul className="grid gap-y-16 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {data?.map((p, i) => <ProductCard key={p.id} product={p} rotate={ROTATIONS[i % ROTATIONS.length]} index={i} />)}
            </ul>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function ProductCard({ product, rotate, index }: { product: Product; rotate: number; index: number }) {
  const offsetClass = index % 3 === 1 ? "lg:mt-12" : index % 3 === 2 ? "lg:mt-4" : "";
  return (
    <li className={offsetClass}>
      <Link
        to="/shop/$slug"
        params={{ slug: product.slug }}
        className="group block"
      >
        <figure
          className="scrapbook rounded-md"
          style={{ transform: `rotate(${rotate}deg)` }}
        >
          <span
            className="tape rounded-sm"
            style={{ top: -10, left: `calc(50% - 45px)`, transform: `rotate(${-rotate * 1.5}deg)` }}
            aria-hidden="true"
          />
          <div className="aspect-[4/5] overflow-hidden rounded-sm">
            <img
              src={imageUrl(product.image_path)}
              alt={product.title}
              loading="lazy"
              width={1024}
              height={1280}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <figcaption className="mt-3 text-center">
            <span className="handwritten block text-2xl text-cocoa group-hover:text-clay">
              {product.title}
            </span>
            {product.tagline && (
              <span className="mt-1 block text-sm text-cocoa/60">{product.tagline}</span>
            )}
            <span className="mt-2 inline-block text-base text-cocoa">
              {formatMoney(product.price_cents, product.currency)}
            </span>
          </figcaption>
        </figure>
      </Link>
    </li>
  );
}

function SkeletonGrid() {
  return (
    <ul className="grid gap-y-16 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className={i % 3 === 1 ? "lg:mt-12" : ""}>
          <div className="scrapbook rounded-md" style={{ transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)` }}>
            <div className="aspect-[4/5] animate-pulse rounded-sm bg-secondary" />
            <div className="mx-auto mt-4 h-6 w-2/3 animate-pulse rounded bg-secondary" />
          </div>
        </li>
      ))}
    </ul>
  );
}
