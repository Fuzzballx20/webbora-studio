import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  variantId: string;
  productId: string;
  slug: string;
  title: string;
  size: string;
  imagePath: string | null;
  unitPriceCents: number;
  currency: string;
  quantity: number;
  maxStock: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  currency: string;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "webbora.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const add = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        const next = Math.min(existing.quantity + qty, item.maxStock || existing.quantity + qty);
        return prev.map((i) => (i.variantId === item.variantId ? { ...i, quantity: next } : i));
      }
      return [...prev, { ...item, quantity: Math.min(qty, item.maxStock || qty) }];
    });
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.variantId === variantId
            ? { ...i, quantity: Math.max(1, Math.min(qty, i.maxStock || qty)) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotalCents = items.reduce((n, i) => n + i.quantity * i.unitPriceCents, 0);
    const currency = items[0]?.currency ?? "USD";
    return { items, count, subtotalCents, currency, add, setQty, remove, clear };
  }, [items, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
