import type { LocalOrder } from "./me-store";

const REF_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export type CollectLine = {
  sku: string;
  name: string;
  qty: number;
  priceMur: number;
};

export type CollectTicketDraft = {
  storefrontId: string;
  slug: string;
  shopName: string;
  collectionPoint: string;
  collectionAddress?: string;
  dinerName: string;
  lines: CollectLine[];
  createdAt: string;
};

export function makeCollectRef(input: { storefrontId: string; createdAt: string }) {
  const seed = `${input.storefrontId}:${input.createdAt}`;
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  let n = hash >>> 0;
  let body = "";
  for (let i = 0; i < 4; i += 1) {
    body += REF_ALPHABET[n % REF_ALPHABET.length];
    n = Math.floor(n / REF_ALPHABET.length) ^ (n >>> 8);
  }
  return `KBZ-${body}`;
}

export function ticketLinesTotal(lines: CollectLine[]) {
  return lines.reduce((sum, line) => sum + line.qty * line.priceMur, 0);
}

export function buildCollectTicket(draft: CollectTicketDraft): LocalOrder | null {
  const lines = draft.lines.filter((line) => line.qty > 0 && line.name.trim());
  if (lines.length === 0) return null;
  const dinerName = draft.dinerName.trim() || "Guest";
  const createdAt = draft.createdAt;
  const stamp = Date.parse(createdAt);
  const id = `${draft.storefrontId}-${Number.isNaN(stamp) ? createdAt : stamp}`;
  return {
    id,
    ref: makeCollectRef({ storefrontId: draft.storefrontId, createdAt }),
    storefrontId: draft.storefrontId,
    slug: draft.slug,
    shopName: draft.shopName,
    collectionPoint: draft.collectionPoint,
    collectionAddress: draft.collectionAddress,
    dinerName,
    lines,
    totalMur: ticketLinesTotal(lines),
    createdAt,
    status: "asked",
  };
}

export function findTicket(orders: LocalOrder[], id: string) {
  const decoded = decodeURIComponent(id);
  return orders.find((order) => order.id === id || order.id === decoded) ?? null;
}

export function ticketRef(order: Pick<LocalOrder, "ref" | "storefrontId" | "createdAt">) {
  return order.ref ?? makeCollectRef({ storefrontId: order.storefrontId, createdAt: order.createdAt });
}

export function findTicketByRef(orders: LocalOrder[], ref: string) {
  const needle = ref.trim().toUpperCase();
  if (!needle) return null;
  return orders.find((order) => ticketRef(order) === needle) ?? null;
}

export function formatTicketWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Indian/Mauritius",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const day = pick("day");
  const month = pick("month");
  const hour = pick("hour");
  const minute = pick("minute");
  if (!day || !month || !hour || !minute) return "";
  return `${day} ${month} · ${hour}:${minute}`;
}
