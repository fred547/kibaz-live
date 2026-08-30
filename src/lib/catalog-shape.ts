import { compiledCatalog, type Friend, type Place, type ShopItem, type ShopSection } from "@/lib/kibaz-data";

export type CatalogShop = {
  storefrontId: string;
  slug: string;
  config: {
    schemaVersion: number;
    locale: string;
    brand?: { displayName: string };
    seo?: { description?: string };
    fulfilment?: {
      pickupEnabled?: boolean;
      deliveryEnabled?: boolean;
      pickupLabel?: string;
      collectionPoints?: Array<{ id: string; label: string; addressLine?: string }>;
      paymentMethods?: { online?: boolean; payOnCollection?: boolean; payOnDelivery?: boolean };
    };
  };
  sections: Array<{
    id: string;
    title: string;
    items: Array<{
      sku: string;
      name: string;
      priceMur: number;
      photo: string;
      blurb: string;
    }>;
  }>;
};

export type CatalogSnapshot = {
  places: Place[];
  shops: CatalogShop[];
  friends: Friend[];
  source: "postgres" | "compiled";
};

export function asCatalogShop(shop: {
  storefrontId: string;
  slug: string;
  config: CatalogShop["config"] & { sections?: unknown[] };
  sections: ShopSection[] | CatalogShop["sections"];
}): CatalogShop {
  return {
    storefrontId: shop.storefrontId,
    slug: shop.slug,
    config: {
      schemaVersion: shop.config.schemaVersion,
      locale: shop.config.locale,
      ...(shop.config.brand ? { brand: shop.config.brand } : {}),
      ...(shop.config.seo ? { seo: shop.config.seo } : {}),
      ...(shop.config.fulfilment ? { fulfilment: shop.config.fulfilment } : {}),
    },
    sections: shop.sections.map((section) => ({
      id: section.id,
      title: section.title,
      items: section.items.map((item: ShopItem) => ({
        sku: item.sku,
        name: item.name,
        priceMur: item.priceMur,
        photo: item.photo,
        blurb: item.blurb,
      })),
    })),
  };
}

export function compiledSnapshot(): CatalogSnapshot {
  const compiled = compiledCatalog();
  return {
    places: compiled.places,
    shops: compiled.shops.map(asCatalogShop),
    friends: compiled.friends,
    source: "compiled",
  };
}
