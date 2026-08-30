export type RegionId = "north" | "port-louis" | "west" | "plateau" | "south-east";

export type Region = {
  id: RegionId;
  label: string;
  hint: string;
  x: number;
  y: number;
};

/** Pin positions are in the island SVG viewBox (0–100 × 0–140). */
export const REGIONS: Region[] = [
  { id: "north", label: "North", hint: "Grand Baie · Goodlands", x: 50, y: 16 },
  { id: "port-louis", label: "Port Louis", hint: "The harbour", x: 28, y: 40 },
  { id: "west", label: "West", hint: "Flic en Flac", x: 24, y: 72 },
  { id: "plateau", label: "Centre", hint: "Curepipe · Moka · Rose Hill", x: 48, y: 62 },
  { id: "south-east", label: "South-East", hint: "Mahébourg", x: 74, y: 108 },
];

const AREA_TO_REGION: Record<string, RegionId> = {
  "Grand Baie": "north",
  Goodlands: "north",
  "Port Louis": "port-louis",
  "Domaine Les Pailles": "plateau",
  "Rose Hill": "plateau",
  "Quatre Bornes": "plateau",
  Ebène: "plateau",
  Trianon: "plateau",
  Moka: "plateau",
  Curepipe: "plateau",
  "Flic en Flac": "west",
  Mahébourg: "south-east",
};

const SHOP_REGION: Record<string, RegionId> = {
  delixi: "plateau",
  akiba: "plateau",
};

export function isRegionId(value: string | undefined): value is RegionId {
  return REGIONS.some((region) => region.id === value);
}

export function regionIdForArea(area: string): RegionId | null {
  return AREA_TO_REGION[area] ?? null;
}

export function regionById(id: RegionId): Region {
  const region = REGIONS.find((item) => item.id === id);
  if (!region) throw new Error(`Unknown region ${id}`);
  return region;
}

export function regionForShopSlug(slug: string): RegionId | null {
  return SHOP_REGION[slug] ?? null;
}

export function placesInRegion<T extends { area: string }>(places: T[], regionId: RegionId): T[] {
  return places.filter((place) => AREA_TO_REGION[place.area] === regionId);
}

export function shopsInRegion<T extends { slug: string }>(shops: T[], regionId: RegionId): T[] {
  return shops.filter((shop) => SHOP_REGION[shop.slug] === regionId);
}
