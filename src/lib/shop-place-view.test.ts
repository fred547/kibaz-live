import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { shopCardFromConfig, shopPlaceFromConfig, type StorefrontConfig } from "./shop-place-view.ts";

const config: StorefrontConfig = {
  schemaVersion: 1,
  locale: "en-MU",
  sections: [],
  brand: { displayName: "Delixi" },
  fulfilment: {
    pickupEnabled: true,
    deliveryEnabled: false,
    pickupLabel: "Collect",
    collectionPoints: [{ id: "rose-hill", label: "Rose Hill counter" }],
    paymentMethods: { online: true, payOnCollection: false, payOnDelivery: false },
  },
};

describe("shopCardFromConfig", () => {
  it("uses the published brand name and refuses to invent one", () => {
    const card = shopCardFromConfig({ storefrontId: "sf_delixi", slug: "delixi", config });
    assert.equal(card?.name, "Delixi");
    assert.equal(card?.storefrontId, "sf_delixi");
    assert.equal(card?.slug, "delixi");
    assert.equal(card?.summary, null);
    assert.equal(
      shopCardFromConfig({
        storefrontId: "sf_delixi",
        slug: "delixi",
        config: { ...config, brand: undefined },
      }),
      null,
    );
  });

  it("uses the published shop hero for Delixi and Akiba", () => {
    assert.equal(
      shopCardFromConfig({ storefrontId: "sf_delixi", slug: "delixi", config })?.photoUrl,
      "/shop-heroes/delixi.jpg",
    );
    assert.equal(
      shopCardFromConfig({
        storefrontId: "sf_akiba",
        slug: "akiba",
        config: { ...config, brand: { displayName: "Akiba Zone" } },
      })?.photoUrl,
      "/shop-heroes/akiba.jpg",
    );
    assert.equal(
      shopCardFromConfig({ storefrontId: "sf_delixi", slug: "DELIXI", config })?.photoUrl,
      "/shop-heroes/delixi.jpg",
    );
  });

  it("does not invent a photo for an unknown shop slug", () => {
    assert.equal(
      shopCardFromConfig({ storefrontId: "sf_other", slug: "other", config })?.photoUrl,
      null,
    );
  });

  it("ships the hero JPEGs from the public root", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const root = join(here, "../../public/shop-heroes");
    assert.equal(existsSync(join(root, "delixi.jpg")), true);
    assert.equal(existsSync(join(root, "akiba.jpg")), true);
  });
});

describe("shopPlaceFromConfig", () => {
  it("is takeaway/collection only — no dine-in, no delivery field", () => {
    const place = shopPlaceFromConfig({ storefrontId: "sf_delixi", slug: "delixi", config });
    assert.equal(place?.photoUrl, "/shop-heroes/delixi.jpg");
    assert.equal(place?.dineIn, false);
    assert.equal(place?.pickupEnabled, true);
    assert.deepEqual(place?.collectionPoints, [{ id: "rose-hill", label: "Rose Hill counter" }]);
    assert.equal(place && "deliveryEnabled" in place, false);
  });

  it("returns null when pickup is off or there is no collection point", () => {
    assert.equal(
      shopPlaceFromConfig({
        storefrontId: "sf_delixi",
        slug: "delixi",
        config: {
          ...config,
          fulfilment: { pickupEnabled: true, deliveryEnabled: true, collectionPoints: [] },
        },
      }),
      null,
    );
    assert.equal(
      shopPlaceFromConfig({
        storefrontId: "sf_delixi",
        slug: "delixi",
        config: {
          ...config,
          fulfilment: {
            pickupEnabled: false,
            deliveryEnabled: true,
            collectionPoints: [{ id: "x", label: "X" }],
          },
        },
      }),
      null,
    );
  });
});
