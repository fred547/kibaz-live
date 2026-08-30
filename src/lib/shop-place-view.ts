export interface StorefrontConfig {
  schemaVersion: number;
  locale: string;
  sections: unknown[];
  brand?: { displayName: string };
  seo?: { description?: string };
  fulfilment?: {
    pickupEnabled?: boolean;
    deliveryEnabled?: boolean;
    pickupLabel?: string;
    collectionPoints?: Array<{ id: string; label: string; addressLine?: string }>;
    paymentMethods?: { online?: boolean; payOnCollection?: boolean; payOnDelivery?: boolean };
  };
}

export interface ShopCardView {
  storefrontId: string;
  slug: string;
  name: string;
  photoUrl: string | null;
  summary: string | null;
}

export interface ShopPlaceView extends ShopCardView {
  dineIn: false;
  pickupEnabled: true;
  collectionPoints: Array<{ id: string; label: string; addressLine?: string }>;
}

const SHOP_HERO_BY_SLUG: Readonly<Record<string, string>> = {
  delixi: "/shop-heroes/delixi.jpg",
  akiba: "/shop-heroes/akiba.jpg",
};

function shopHeroUrl(slug: string): string | null {
  const key = slug.trim().toLowerCase();
  return SHOP_HERO_BY_SLUG[key] ?? null;
}

export function shopCardFromConfig(input: {
  storefrontId: string;
  slug: string;
  config: StorefrontConfig;
}): ShopCardView | null {
  const name = input.config.brand?.displayName?.trim();
  if (!name) return null;
  return {
    storefrontId: input.storefrontId,
    slug: input.slug,
    name,
    photoUrl: shopHeroUrl(input.slug),
    summary: input.config.seo?.description?.trim() || null,
  };
}

export function shopPlaceFromConfig(input: {
  storefrontId: string;
  slug: string;
  config: StorefrontConfig;
}): ShopPlaceView | null {
  const card = shopCardFromConfig(input);
  if (!card) return null;
  const fulfilment = input.config.fulfilment;
  const collectionPoints = (fulfilment?.collectionPoints ?? []).map((point) => ({
    id: point.id,
    label: point.label,
    ...(point.addressLine ? { addressLine: point.addressLine } : {}),
  }));
  if (fulfilment?.pickupEnabled !== true || collectionPoints.length === 0) return null;
  return { ...card, dineIn: false, pickupEnabled: true, collectionPoints };
}
