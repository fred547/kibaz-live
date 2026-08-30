import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StickerKey } from "./kibaz-data";

export type LocalOrder = {
  id: string;
  ref?: string;
  storefrontId: string;
  slug: string;
  shopName: string;
  collectionPoint: string;
  collectionAddress?: string;
  dinerName?: string;
  lines: Array<{ sku: string; name: string; qty: number; priceMur: number }>;
  totalMur: number;
  createdAt: string;
  status: "asked" | "collected";
};

const ORDERS_MIRROR = "kibaz-orders";

function readMirroredOrders(): LocalOrder[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_MIRROR);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as LocalOrder[]) : [];
  } catch {
    return [];
  }
}

function writeMirroredOrders(orders: LocalOrder[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(ORDERS_MIRROR, JSON.stringify(orders));
  } catch {
    /* quota */
  }
}

type MeState = {
  name: string;
  sticker: StickerKey;
  savedPlaceIds: string[];
  crownedPlaceIds: string[];
  orders: LocalOrder[];
  setName: (name: string) => void;
  setSticker: (sticker: StickerKey) => void;
  toggleSaved: (placeId: string) => void;
  toggleCrown: (placeId: string) => void;
  addOrder: (order: LocalOrder) => void;
  markCollected: (id: string) => void;
};

export const useMeStore = create<MeState>()(
  persist(
    (set, get) => ({
      name: "Frederick",
      sticker: "sleepy",
      savedPlaceIds: [],
      crownedPlaceIds: [],
      orders: [],
      setName: (name) => set({ name: name.trim() || "Frederick" }),
      setSticker: (sticker) => set({ sticker }),
      toggleSaved: (placeId) => {
        const saved = get().savedPlaceIds;
        set({
          savedPlaceIds: saved.includes(placeId)
            ? saved.filter((id) => id !== placeId)
            : [...saved, placeId],
        });
      },
      toggleCrown: (placeId) => {
        const crowned = get().crownedPlaceIds;
        set({
          crownedPlaceIds: crowned.includes(placeId)
            ? crowned.filter((id) => id !== placeId)
            : [...crowned, placeId],
        });
      },
      addOrder: (order) => {
        const orders = [order, ...get().orders.filter((row) => row.id !== order.id)].slice(0, 20);
        writeMirroredOrders(orders);
        set({ orders });
      },
      markCollected: (id) => {
        const orders = get().orders.map((order) =>
          order.id === id && order.status === "asked" ? { ...order, status: "collected" as const } : order,
        );
        writeMirroredOrders(orders);
        set({ orders });
      },
    }),
    { name: "kibaz-me", skipHydration: true },
  ),
);

export function rehydrateMe() {
  const done = Promise.resolve(useMeStore.persist.rehydrate());
  void done.then(() => {
    const mirrored = readMirroredOrders();
    if (mirrored.length === 0) return;
    if (useMeStore.getState().orders.length === 0) {
      useMeStore.setState({ orders: mirrored });
    }
  });
}

