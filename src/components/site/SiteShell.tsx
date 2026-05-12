import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";

const navLinks = [
  { to: "/shop", label: "Shop", note: "from the rack" },
  { to: "/#services", label: "Services", note: "made for you" },
  { to: "/#about", label: "About", note: "hello, i'm Webbora" },
  { to: "/#contact", label: "Contact", note: "say hello ✿" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:py-8">
      <Link to="/" className="flex items-baseline gap-2">
        <span className="font-serif text-2xl tracking-tight text-cocoa">Webbora</span>
        <span className="handwritten text-lg text-clay">— designs by</span>
      </Link>

      <nav className="hidden items-center gap-8 text-sm text-cocoa/80 md:flex">
        <Link to="/shop" className="hover:text-clay transition-colors" activeProps={{ className: "text-clay" }}>
          Shop
        </Link>
        <a href="/#services" className="hover:text-clay transition-colors">Services</a>
        <a href="/#about" className="hover:text-clay transition-colors">About</a>
        <a href="/#contact" className="hover:text-clay transition-colors">Contact</a>
        <CartButton count={count} />
      </nav>

      <div className="flex items-center gap-2 md:hidden">
        <CartButton count={count} compact />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cocoa/30 bg-cream/70 text-cocoa shadow-[var(--shadow-soft)] backdrop-blur transition hover:border-clay hover:text-clay"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-cocoa/40 backdrop-blur-sm"
        />
        <div
          className={`paper-texture absolute right-3 top-3 w-[min(22rem,calc(100vw-1.5rem))] rounded-3xl border border-border/70 p-6 shadow-[var(--shadow-card)] transition-all duration-300 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          }`}
          style={{ transform: open ? "rotate(-1deg)" : undefined }}
        >
          <span
            className="tape rounded-sm"
            style={{ top: -10, left: "calc(50% - 45px)", transform: "rotate(-3deg)" }}
            aria-hidden="true"
          />
          <div className="flex items-center justify-between">
            <p className="handwritten text-2xl text-clay">— wander in —</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cocoa/20 text-cocoa hover:border-clay hover:text-clay"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <ul className="mt-6 space-y-1">
            {navLinks.map((l, i) => (
              <li key={l.to}>
                <a
                  href={l.to}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline justify-between rounded-2xl px-3 py-3 transition hover:bg-secondary/70"
                  style={{ transform: `rotate(${i % 2 === 0 ? -0.4 : 0.4}deg)` }}
                >
                  <span className="font-serif text-2xl text-cocoa group-hover:text-clay">{l.label}</span>
                  <span className="handwritten text-base text-cocoa/55 group-hover:text-clay">{l.note}</span>
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="group flex items-baseline justify-between rounded-2xl px-3 py-3 transition hover:bg-secondary/70"
              >
                <span className="font-serif text-2xl text-cocoa group-hover:text-clay">Basket</span>
                <span className="handwritten text-base text-cocoa/55 group-hover:text-clay">
                  {count > 0 ? `${count} piece${count === 1 ? "" : "s"}` : "still empty"}
                </span>
              </Link>
            </li>
          </ul>
          <p className="handwritten mt-6 border-t border-border/60 pt-4 text-center text-lg text-cocoa/55">
            with love, from the studio ✿
          </p>
        </div>
      </div>
    </header>
  );
}

function CartButton({ count, compact = false }: { count: number; compact?: boolean }) {
  return (
    <Link
      to="/cart"
      aria-label={`Basket — ${count} item${count === 1 ? "" : "s"}`}
      className={`relative inline-flex h-11 items-center gap-2 rounded-full border border-cocoa/30 bg-cream/70 px-3 text-cocoa shadow-[var(--shadow-soft)] backdrop-blur transition hover:border-clay hover:text-clay ${
        compact ? "w-11 justify-center px-0" : ""
      }`}
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
      {!compact && <span className="handwritten text-lg">basket</span>}
      {count > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1.5 text-[11px] font-medium text-cream shadow">
          {count}
        </span>
      )}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-6 py-10 text-center">
      <p className="text-sm text-cocoa/55">
        © {new Date().getFullYear()} Designs by Webbora · made by hand, with patience.
      </p>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
