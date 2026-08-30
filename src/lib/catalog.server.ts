import {
  asCatalogShop,
  compiledSnapshot,
  type CatalogSnapshot,
  type CatalogShop,
} from "@/lib/catalog-shape";
import { FRIENDS, PLACES, SHOPS, type Friend, type Place } from "@/lib/kibaz-data";

type CatalogRow = {
  kind: string;
  id: string;
  payload: unknown;
};

function parsePayload(raw: unknown): unknown {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return raw;
}

function asPlace(raw: unknown): Place | null {
  const value = parsePayload(raw);
  if (!value || typeof value !== "object") return null;
  const place = value as Place;
  if (typeof place.id !== "string" || typeof place.name !== "string") return null;
  if (!Array.isArray(place.dishes)) return null;
  return place;
}

function asShop(raw: unknown): CatalogShop | null {
  const value = parsePayload(raw);
  if (!value || typeof value !== "object") return null;
  const shop = value as {
    storefrontId?: string;
    slug?: string;
    config?: CatalogShop["config"] & { sections?: unknown[] };
    sections?: CatalogShop["sections"];
  };
  if (typeof shop.storefrontId !== "string" || typeof shop.slug !== "string") return null;
  if (!shop.config || !Array.isArray(shop.sections)) return null;
  return asCatalogShop({
    storefrontId: shop.storefrontId,
    slug: shop.slug,
    config: shop.config,
    sections: shop.sections,
  });
}

function asFriend(raw: unknown): Friend | null {
  const value = parsePayload(raw);
  if (!value || typeof value !== "object") return null;
  const friend = value as Friend;
  if (typeof friend.id !== "string" || typeof friend.name !== "string") return null;
  return friend;
}

function shouldUseDatabase() {
  const url = typeof process !== "undefined" ? process.env.DATABASE_URL?.trim() : "";
  if (url) return true;
  // Vite live preview can boot PGLite from node_modules. The production
  // Vercel bundle does not ship the PGLite wasm file, so skip it there.
  return process.env.NODE_ENV !== "production";
}

async function seedIfEmpty() {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const counts = await sql<{ n: number }>`select count(*)::int as n from kibaz_catalog`;
  if ((counts[0]?.n ?? 0) > 0) return;

  for (const place of PLACES) {
    await sql.query(
      "insert into kibaz_catalog (kind, id, payload) values ($1, $2, $3::jsonb) on conflict (kind, id) do nothing",
      ["place", place.id, JSON.stringify(place)],
    );
  }
  for (const shop of SHOPS) {
    await sql.query(
      "insert into kibaz_catalog (kind, id, payload) values ($1, $2, $3::jsonb) on conflict (kind, id) do nothing",
      ["shop", shop.storefrontId, JSON.stringify(asCatalogShop(shop))],
    );
  }
  for (const friend of FRIENDS) {
    await sql.query(
      "insert into kibaz_catalog (kind, id, payload) values ($1, $2, $3::jsonb) on conflict (kind, id) do nothing",
      ["friend", friend.id, JSON.stringify(friend)],
    );
  }
}

export async function readCatalog(): Promise<CatalogSnapshot> {
  if (!shouldUseDatabase()) return compiledSnapshot();
  try {
    await seedIfEmpty();
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<CatalogRow>`select kind, id, payload from kibaz_catalog`;
    const places = rows.filter((row) => row.kind === "place").map((row) => asPlace(row.payload)).filter((row): row is Place => row !== null);
    const shops = rows.filter((row) => row.kind === "shop").map((row) => asShop(row.payload)).filter((row): row is CatalogShop => row !== null);
    const friends = rows.filter((row) => row.kind === "friend").map((row) => asFriend(row.payload)).filter((row): row is Friend => row !== null);
    if (places.length === 0 || shops.length === 0) return compiledSnapshot();
    return { places, shops, friends, source: "postgres" };
  } catch {
    return compiledSnapshot();
  }
}
