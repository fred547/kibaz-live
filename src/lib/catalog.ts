import { createServerFn } from "@tanstack/react-start";
import { compiledSnapshot, type CatalogSnapshot } from "@/lib/catalog-shape";

export type { CatalogShop, CatalogSnapshot } from "@/lib/catalog-shape";
export { compiledSnapshot } from "@/lib/catalog-shape";

export const loadCatalog = createServerFn({ method: "GET" }).handler(async (): Promise<CatalogSnapshot> => {
  const { readCatalog } = await import("@/lib/catalog.server");
  return readCatalog();
});

export async function loadCatalogSafe(): Promise<CatalogSnapshot> {
  try {
    const snapshot = await loadCatalog();
    if (snapshot.places.length > 0) return snapshot;
  } catch {
    // Preview or a cold database should never blank the app.
  }
  return compiledSnapshot();
}
