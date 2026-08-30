import { shopCardFromConfig, shopPlaceFromConfig, type StorefrontConfig } from "./shop-place-view";

export type StickerKey = "sleepy" | "hungry" | "mango" | "crown";

export type Friend = {
  id: string;
  name: string;
  sticker: StickerKey;
  note: string;
  favouritePlaceId: string;
};

export type Dish = {
  id: string;
  name: string;
  photo: string;
  note: string;
  priceMur?: number;
};

export type Place = {
  id: string;
  name: string;
  area: string;
  photo: string;
  blurb: string;
  kind: "restaurant" | "foodcourt" | "street";
  crowns: number;
  google?: { score: number; count: number };
  trustedBy: string[];
  dishes: Dish[];
  kitchenCount?: number;
};

export type ShopItem = {
  sku: string;
  name: string;
  priceMur: number;
  photo: string;
  blurb: string;
};

export type ShopSection = {
  id: string;
  title: string;
  items: ShopItem[];
};

export type ShopRecord = {
  storefrontId: string;
  slug: string;
  config: StorefrontConfig;
  sections: ShopSection[];
};

export const STICKER_SRC: Record<StickerKey, string> = {
  sleepy: "/stickers/sleepy.jpg",
  hungry: "/stickers/hungry.jpg",
  mango: "/stickers/mango.jpg",
  crown: "/stickers/crown.jpg",
};

export const FRIENDS: Friend[] = [
  {
    id: "aisha",
    name: "Aisha",
    sticker: "hungry",
    note: "Always knows where the rice is right.",
    favouritePlaceId: "ev-seven",
  },
  {
    id: "priya",
    name: "Priya",
    sticker: "mango",
    note: "Sends you home with a leftover box.",
    favouritePlaceId: "karai-kreol",
  },
  {
    id: "jean",
    name: "Jean",
    sticker: "sleepy",
    note: "Lunch table, every Friday.",
    favouritePlaceId: "kwizine-mama",
  },
  {
    id: "maya",
    name: "Maya",
    sticker: "crown",
    note: "Will cross the island for a crust.",
    favouritePlaceId: "neapolitana",
  },
];

export const PLACES: Place[] = [
  {
    id: "ev-seven",
    name: "Ev Seven Lock's Sushi",
    area: "Grand Baie",
    photo: "/places/sushi.jpg",
    blurb: "Quiet nigiri. Ask for the daily fish.",
    kind: "restaurant",
    crowns: 18,
    trustedBy: ["aisha"],
    dishes: [
      { id: "nigiri-set", name: "Nigiri set", photo: "/places/sushi.jpg", note: "What Aisha always orders.", priceMur: 890 },
      { id: "spicy-tuna", name: "Spicy tuna roll", photo: "/places/sushi.jpg", note: "Clean heat, not a gimmick.", priceMur: 420 },
    ],
  },
  {
    id: "panda",
    name: "Panda",
    area: "Port Louis",
    photo: "/places/chinese.jpg",
    blurb: "Wok that still sounds like a wok.",
    kind: "restaurant",
    crowns: 11,
    trustedBy: ["jean"],
    dishes: [
      { id: "dumpling", name: "Steamed dumplings", photo: "/places/chinese.jpg", note: "Share the steamer.", priceMur: 280 },
      { id: "noodles", name: "Wok noodles", photo: "/places/chinese.jpg", note: "Ask for extra greens.", priceMur: 320 },
    ],
  },
  {
    id: "cozy-burger",
    name: "Cozy Burger",
    area: "Ebène",
    photo: "/places/burger.jpg",
    blurb: "Smash, pickle, no theatre.",
    kind: "restaurant",
    crowns: 9,
    trustedBy: ["aisha", "maya"],
    dishes: [
      { id: "smash", name: "Cozy smash", photo: "/places/burger.jpg", note: "Cheese to the edge.", priceMur: 295 },
    ],
  },
  {
    id: "fred-luigi",
    name: "Fred Luigi's Italian Pizzeria & Pasta Bar",
    area: "Curepipe",
    photo: "/places/pizza.jpg",
    blurb: "The crust people argue about, kindly.",
    kind: "restaurant",
    crowns: 22,
    trustedBy: ["maya"],
    dishes: [
      { id: "margherita", name: "Margherita", photo: "/places/pizza.jpg", note: "Maya's order. Don't skip it.", priceMur: 450 },
    ],
  },
  {
    id: "fred-sourdough",
    name: "Fred Everything Sourdough",
    area: "Moka",
    photo: "/places/sourdough.jpg",
    blurb: "Warm loaf, butter, done.",
    kind: "restaurant",
    crowns: 14,
    trustedBy: ["jean"],
    dishes: [
      { id: "loaf", name: "Country loaf", photo: "/places/sourdough.jpg", note: "Tear it at the table.", priceMur: 180 },
    ],
  },
  {
    id: "pyramid-snack",
    name: "Pyramid Snack",
    area: "Rose Hill",
    photo: "/street/dholl-puri.jpg",
    blurb: "Dholl puri and gâteau piment while they're still singing.",
    kind: "street",
    crowns: 8,
    trustedBy: ["priya"],
    dishes: [
      { id: "dholl", name: "Dholl puri", photo: "/street/dholl-puri.jpg", note: "Two, from memory.", priceMur: 40 },
      { id: "piment", name: "Gâteau piment", photo: "/street/gateau-piment.jpg", note: "Hot, green, gone.", priceMur: 15 },
    ],
  },
  {
    id: "alouda-marche",
    name: "Alouda du Marché",
    area: "Port Louis",
    photo: "/street/alouda.jpg",
    blurb: "Cold, pink, from the market.",
    kind: "street",
    crowns: 21,
    trustedBy: ["jean", "priya"],
    dishes: [
      { id: "alouda-rose", name: "Alouda rose", photo: "/street/alouda.jpg", note: "Milk, basil seed, ice.", priceMur: 50 },
    ],
  },
  {
    id: "escale-creole",
    name: "Escale Créole",
    area: "Mahébourg",
    photo: "/places/creole.jpg",
    blurb: "Family table. Stay for the pickle.",
    kind: "restaurant",
    crowns: 16,
    trustedBy: ["priya", "jean"],
    dishes: [
      { id: "cari", name: "Cari poule", photo: "/places/creole.jpg", note: "The one to pass on.", priceMur: 380 },
    ],
  },
  {
    id: "le-fangourin",
    name: "Le Fangourin",
    area: "Domaine Les Pailles",
    photo: "/places/home-kreol.jpg",
    blurb: "Garden, farata, no rush.",
    kind: "restaurant",
    crowns: 12,
    trustedBy: [],
    dishes: [
      { id: "farata", name: "Farata & rougaille", photo: "/places/home-kreol.jpg", note: "Eat it hot.", priceMur: 260 },
    ],
  },
  {
    id: "chuan",
    name: "Chuan",
    area: "Quatre Bornes",
    photo: "/places/chinese.jpg",
    blurb: "Chilli oil that knows when to stop.",
    kind: "restaurant",
    crowns: 10,
    trustedBy: ["aisha"],
    dishes: [
      { id: "mapo", name: "Mapo tofu", photo: "/places/chinese.jpg", note: "Soft heat.", priceMur: 340 },
    ],
  },
  {
    id: "felicita",
    name: "Felicità",
    area: "Grand Baie",
    photo: "/places/pizza.jpg",
    blurb: "Pasta that doesn't shout.",
    kind: "restaurant",
    crowns: 7,
    trustedBy: ["maya"],
    dishes: [
      { id: "cacio", name: "Cacio e pepe", photo: "/places/pizza.jpg", note: "Pepper first.", priceMur: 490 },
    ],
  },
  {
    id: "eclats-eden",
    name: "Éclats d'Eden",
    area: "Flic en Flac",
    photo: "/places/creole.jpg",
    blurb: "A calm plate by the west coast.",
    kind: "restaurant",
    crowns: 6,
    google: { score: 5, count: 335 },
    trustedBy: [],
    dishes: [
      { id: "catch", name: "Catch of the day", photo: "/places/creole.jpg", note: "Ask what came in.", priceMur: 720 },
    ],
  },
  {
    id: "karai-kreol",
    name: "Karaï Kreol",
    area: "Curepipe",
    photo: "/places/creole.jpg",
    blurb: "Home fire. Priya will tell you to go.",
    kind: "restaurant",
    crowns: 15,
    google: { score: 5, count: 240 },
    trustedBy: ["priya"],
    dishes: [
      { id: "rougaille", name: "Rougaille boulettes", photo: "/places/creole.jpg", note: "Priya's pick.", priceMur: 310 },
    ],
  },
  {
    id: "kwizine-mama",
    name: "Kwizine Mama-Kot Nou (Chez Filo et Stephanie)",
    area: "Goodlands",
    photo: "/places/home-kreol.jpg",
    blurb: "Like eating at someone's mum's.",
    kind: "restaurant",
    crowns: 13,
    google: { score: 5, count: 207 },
    trustedBy: ["jean"],
    dishes: [
      { id: "briani", name: "Briani", photo: "/places/home-kreol.jpg", note: "Friday, if they have it.", priceMur: 250 },
    ],
  },
  {
    id: "klub-kebab",
    name: "KLUB KEBAB",
    area: "Port Louis",
    photo: "/places/kebab.jpg",
    blurb: "Late, generous, still hot.",
    kind: "restaurant",
    crowns: 9,
    google: { score: 5, count: 163 },
    trustedBy: ["aisha"],
    dishes: [
      { id: "doner", name: "Doner wrap", photo: "/places/kebab.jpg", note: "Garlic sauce, not a flood.", priceMur: 180 },
    ],
  },
  {
    id: "paradisio",
    name: "Paradisio Pizza Maurice",
    area: "Flic en Flac",
    photo: "/places/pizza.jpg",
    blurb: "Beach-road pizza that holds.",
    kind: "restaurant",
    crowns: 8,
    google: { score: 5, count: 159 },
    trustedBy: ["maya"],
    dishes: [
      { id: "diavola", name: "Diavola", photo: "/places/pizza.jpg", note: "A little fire.", priceMur: 480 },
    ],
  },
  {
    id: "neapolitana",
    name: "Neapolitana pizzas",
    area: "Moka",
    photo: "/places/pizza.jpg",
    blurb: "Leopard spots. Maya's hill.",
    kind: "restaurant",
    crowns: 19,
    google: { score: 5, count: 107 },
    trustedBy: ["maya"],
    dishes: [
      { id: "marinara", name: "Marinara", photo: "/places/pizza.jpg", note: "No cheese, still the one.", priceMur: 390 },
    ],
  },
  {
    id: "tribeca",
    name: "Tribeca Mall Trianon",
    area: "Trianon",
    photo: "/places/foodcourt.jpg",
    blurb: "Order from your seat.",
    kind: "foodcourt",
    crowns: 4,
    trustedBy: ["jean", "aisha"],
    kitchenCount: 41,
    dishes: [
      { id: "seat", name: "From your seat", photo: "/places/foodcourt.jpg", note: "Forty-one kitchens, one table." },
    ],
  },
];

const DELIXI_CONFIG: StorefrontConfig = {
  schemaVersion: 1,
  locale: "en-MU",
  sections: [],
  brand: { displayName: "Delixi" },
  seo: { description: "Electrical, collect in Rose Hill." },
  fulfilment: {
    pickupEnabled: true,
    deliveryEnabled: false,
    pickupLabel: "Collect",
    collectionPoints: [
      { id: "rose-hill", label: "Rose Hill counter", addressLine: "Royal Road, Rose Hill" },
    ],
    paymentMethods: { online: false, payOnCollection: true, payOnDelivery: false },
  },
};

const AKIBA_CONFIG: StorefrontConfig = {
  schemaVersion: 1,
  locale: "en-MU",
  sections: [],
  brand: { displayName: "Akiba Zone" },
  seo: { description: "Tokens and PS5 hours. Phoenix Mall." },
  fulfilment: {
    pickupEnabled: true,
    deliveryEnabled: false,
    pickupLabel: "Collect",
    collectionPoints: [
      { id: "phoenix-mall", label: "Phoenix Mall", addressLine: "Akiba Zone, Phoenix Mall" },
    ],
    paymentMethods: { online: false, payOnCollection: true, payOnDelivery: false },
  },
};

export const SHOPS: ShopRecord[] = [
  {
    storefrontId: "sf_delixi",
    slug: "delixi",
    config: DELIXI_CONFIG,
    sections: [
      {
        id: "breakers",
        title: "Breakers",
        items: [
          { sku: "DX3-010", name: "DX3 MCB 10A", priceMur: 185, photo: "/products/mcb.jpg", blurb: "Single pole." },
          { sku: "DX3-016", name: "DX3 MCB 16A", priceMur: 195, photo: "/products/mcb.jpg", blurb: "Lighting circuits." },
          { sku: "DX3-001", name: "DX3 MCB 32A", priceMur: 245, photo: "/products/mcb.jpg", blurb: "Cooker / heavy load." },
          { sku: "DX3-RCBO-25", name: "DX3 RCBO 25A 30mA", priceMur: 890, photo: "/products/mcb.jpg", blurb: "Combined protection." },
        ],
      },
      {
        id: "wiring",
        title: "Wiring & light",
        items: [
          { sku: "DX-SW-1G", name: "1-gang switch", priceMur: 95, photo: "/products/socket.jpg", blurb: "Ivory, 10A." },
          { sku: "DX-SK-2G", name: "2-gang socket 13A", priceMur: 145, photo: "/products/socket.jpg", blurb: "Switched twin." },
          { sku: "DX-LED-7", name: "LED downlight 7W", priceMur: 175, photo: "/products/led.jpg", blurb: "Warm white." },
        ],
      },
    ],
  },
  {
    storefrontId: "sf_akiba",
    slug: "akiba",
    config: AKIBA_CONFIG,
    sections: [
      {
        id: "tokens",
        title: "Tokens",
        items: [
          { sku: "AKIBA-TOK-035", name: "Token pack Rs 35 (1 token)", priceMur: 35, photo: "/products/token.jpg", blurb: "1 token." },
          { sku: "AKIBA-TOK-100", name: "Token pack Rs 100 (3 tokens)", priceMur: 100, photo: "/products/token.jpg", blurb: "3 tokens." },
          { sku: "AKIBA-TOK-200", name: "Token pack Rs 200 (6 tokens)", priceMur: 200, photo: "/products/token.jpg", blurb: "6 tokens." },
          { sku: "AKIBA-TOK-300", name: "Token pack Rs 300 (11 tokens)", priceMur: 300, photo: "/products/token.jpg", blurb: "11 tokens." },
          { sku: "AKIBA-TOK-500", name: "Token pack Rs 500 (18 tokens)", priceMur: 500, photo: "/products/token.jpg", blurb: "18 tokens." },
          { sku: "AKIBA-TOK-1000", name: "Token pack Rs 1000 (40 tokens)", priceMur: 1000, photo: "/products/token.jpg", blurb: "40 tokens." },
        ],
      },
      {
        id: "ps5",
        title: "PS5 playtime",
        items: [
          { sku: "AKIBA-PS5-SOLO-1H", name: "1 Controller + 1 PS5 (SOLO) · 1h", priceMur: 175, photo: "/products/ps5.jpg", blurb: "Solo hour." },
          { sku: "AKIBA-PS5-SOLO-2H", name: "1 Controller + 1 PS5 (SOLO) · 2h", priceMur: 300, photo: "/products/ps5.jpg", blurb: "Solo two hours." },
          { sku: "AKIBA-PS5-GUEST-1H", name: "1 Controller + 1 PS5 + Guest · 1h", priceMur: 210, photo: "/products/ps5.jpg", blurb: "With a guest." },
          { sku: "AKIBA-PS5-GUEST-2H", name: "1 Controller + 1 PS5 + Guest · 2h", priceMur: 350, photo: "/products/ps5.jpg", blurb: "With a guest." },
          { sku: "AKIBA-PS5-2P-1H", name: "2 Controllers + 1 PS5 + Guest · 1h", priceMur: 400, photo: "/products/ps5.jpg", blurb: "Two pads." },
          { sku: "AKIBA-PS5-2P-2H", name: "2 Controllers + 1 PS5 + Guest · 2h", priceMur: 680, photo: "/products/ps5.jpg", blurb: "Two pads." },
          { sku: "AKIBA-PS5-3P-1H", name: "3 Controllers + 1 PS5 + Guest · 1h", priceMur: 520, photo: "/products/ps5.jpg", blurb: "Three pads." },
          { sku: "AKIBA-PS5-3P-2H", name: "3 Controllers + 1 PS5 + Guest · 2h", priceMur: 900, photo: "/products/ps5.jpg", blurb: "Three pads." },
          { sku: "AKIBA-PS5-4P-1H", name: "4 Controllers + 1 PS5 + Guest · 1h", priceMur: 600, photo: "/products/ps5.jpg", blurb: "Four pads." },
          { sku: "AKIBA-PS5-4P-2H", name: "4 Controllers + 1 PS5 + Guest · 2h", priceMur: 950, photo: "/products/ps5.jpg", blurb: "Four pads." },
          { sku: "AKIBA-PS5-RACE-1H", name: "Racing Sim + Guest · 1h", priceMur: 350, photo: "/products/race.jpg", blurb: "Sim hour." },
          { sku: "AKIBA-PS5-RACE-2H", name: "Racing Sim + Guest · 2h", priceMur: 595, photo: "/products/race.jpg", blurb: "Sim two hours." },
        ],
      },
    ],
  },
];

export const SHOP_CARDS = SHOPS.map((shop) =>
  shopCardFromConfig({
    storefrontId: shop.storefrontId,
    slug: shop.slug,
    config: shop.config,
  }),
).filter((card): card is NonNullable<typeof card> => card !== null);

export function getShop(slug: string) {
  return SHOPS.find((shop) => shop.slug === slug.toLowerCase()) ?? null;
}

export function getShopPlace(slug: string) {
  const shop = getShop(slug);
  if (!shop) return null;
  return shopPlaceFromConfig({
    storefrontId: shop.storefrontId,
    slug: shop.slug,
    config: shop.config,
  });
}

export function getPlace(id: string) {
  return PLACES.find((place) => place.id === id) ?? null;
}

export function getFriend(id: string) {
  return FRIENDS.find((friend) => friend.id === id) ?? null;
}

export const TRUSTED_PLACES = PLACES.filter((place) => place.trustedBy.length > 0);
export const GOOGLE_PLACES = PLACES.filter((place) => place.google);
export const FOOD_COURTS = PLACES.filter((place) => place.kind === "foodcourt");
export const STREET_PLACES = PLACES.filter((place) => place.kind === "street");
export const TOP_DISHES = PLACES.flatMap((place) =>
  place.dishes.slice(0, 1).map((dish) => ({ ...dish, place })),
);

export const STREET_BITES = [
  {
    id: "dholl",
    name: "Dholl puri",
    photo: "/street/dholl-puri.jpg",
    placeId: "pyramid-snack",
    note: "Two, from memory.",
  },
  {
    id: "piment",
    name: "Gâteau piment",
    photo: "/street/gateau-piment.jpg",
    placeId: "pyramid-snack",
    note: "While it's still singing.",
  },
  {
    id: "alouda",
    name: "Alouda",
    photo: "/street/alouda.jpg",
    placeId: "alouda-marche",
    note: "Milk, basil, ice. Pink.",
  },
] as const;

export const ON_AIR = [
  {
    id: "lunch-1",
    title: "Lunch at the round table",
    caption: "Jean sent this from Goodlands.",
    photo: "/on-air/lunch-1.jpg",
    placeId: "kwizine-mama",
  },
  {
    id: "lunch-2",
    title: "Oven pull",
    caption: "Maya, Moka, still in the peel.",
    photo: "/on-air/lunch-2.jpg",
    placeId: "neapolitana",
  },
];

export function compiledCatalog() {
  return { places: PLACES, shops: SHOPS, friends: FRIENDS };
}

export function shopCardsFrom(
  shops: Array<{
    storefrontId: string;
    slug: string;
    config: {
      brand?: { displayName: string };
      seo?: { description?: string };
    };
  }>,
) {
  return shops
    .map((shop) =>
      shopCardFromConfig({
        storefrontId: shop.storefrontId,
        slug: shop.slug,
        config: {
          schemaVersion: 1,
          locale: "en-MU",
          sections: [],
          brand: shop.config.brand,
          seo: shop.config.seo,
        },
      }),
    )
    .filter((card): card is NonNullable<typeof card> => card !== null);
}

export function viewsFromPlaces(places: Place[]) {
  return {
    trusted: places.filter((place) => place.trustedBy.length > 0),
    google: places.filter((place) => place.google),
    foodCourts: places.filter((place) => place.kind === "foodcourt"),
    street: places.filter((place) => place.kind === "street"),
    topDishes: places.flatMap((place) =>
      place.dishes.slice(0, 1).map((dish) => ({ ...dish, place })),
    ),
  };
}

export function placeById(places: Place[], id: string) {
  return places.find((place) => place.id === id) ?? null;
}

export function shopBySlug<T extends { slug: string }>(shops: T[], slug: string) {
  return shops.find((shop) => shop.slug === slug.toLowerCase()) ?? null;
}
