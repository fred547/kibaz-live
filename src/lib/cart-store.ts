import { create } from "zustand";
import { persist } from "zustand/middleware";

type QtyMap = Record<string, number>;

type CartState = {
  carts: Record<string, QtyMap>;
  setQty: (storefrontId: string, sku: string, qty: number) => void;
  add: (storefrontId: string, sku: string, delta?: number) => void;
  clear: (storefrontId: string) => void;
};

function clampQty(n: number) {
  return Math.max(0, Math.min(99, Math.floor(n)));
}

function writeMirror(storefrontId: string, qty: QtyMap) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(`kibaz-shop-cart:${storefrontId}`, JSON.stringify(qty));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      carts: {},
      setQty: (storefrontId, sku, qty) => {
        const next = { ...(get().carts[storefrontId] ?? {}) };
        const value = clampQty(qty);
        if (value <= 0) delete next[sku];
        else next[sku] = value;
        writeMirror(storefrontId, next);
        set({ carts: { ...get().carts, [storefrontId]: next } });
      },
      add: (storefrontId, sku, delta = 1) => {
        const current = get().carts[storefrontId]?.[sku] ?? 0;
        get().setQty(storefrontId, sku, current + delta);
      },
      clear: (storefrontId) => {
        writeMirror(storefrontId, {});
        const carts = { ...get().carts };
        carts[storefrontId] = {};
        set({ carts });
      },
    }),
    { name: "kibaz-shop-carts", skipHydration: true },
  ),
);

export function cartCount(qty: QtyMap | undefined) {
  if (!qty) return 0;
  return Object.values(qty).reduce((sum, n) => sum + n, 0);
}

export function cartTotal(qty: QtyMap | undefined, priceOf: (sku: string) => number) {
  if (!qty) return 0;
  return Object.entries(qty).reduce((sum, [sku, n]) => sum + priceOf(sku) * n, 0);
}
