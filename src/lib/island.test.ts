import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  REGIONS,
  isRegionId,
  placesInRegion,
  regionForShopSlug,
  regionIdForArea,
  shopsInRegion,
} from "./island.ts";

const AREAS = [
  "Grand Baie",
  "Goodlands",
  "Port Louis",
  "Domaine Les Pailles",
  "Rose Hill",
  "Quatre Bornes",
  "Ebène",
  "Trianon",
  "Moka",
  "Curepipe",
  "Flic en Flac",
  "Mahébourg",
];

describe("island regions", () => {
  it("maps every Kibaz town onto a pin", () => {
    const missing = AREAS.filter((area) => regionIdForArea(area) === null);
    assert.deepEqual(missing, []);
    assert.equal(regionIdForArea("Atlantis"), null);
  });

  it("keeps Delixi and Akiba on the plateau", () => {
    assert.equal(regionForShopSlug("delixi"), "plateau");
    assert.equal(regionForShopSlug("akiba"), "plateau");
    assert.equal(regionForShopSlug("unknown"), null);
    const shops = shopsInRegion([{ slug: "delixi" }, { slug: "akiba" }, { slug: "x" }], "plateau");
    assert.deepEqual(
      shops.map((shop) => shop.slug),
      ["delixi", "akiba"],
    );
  });

  it("groups north-coast places together", () => {
    const north = placesInRegion(
      [
        { area: "Grand Baie", name: "sushi" },
        { area: "Goodlands", name: "mama" },
        { area: "Mahébourg", name: "creole" },
      ],
      "north",
    );
    assert.deepEqual(
      north.map((place) => place.name),
      ["sushi", "mama"],
    );
  });

  it("knows a region id from the map search param", () => {
    assert.equal(isRegionId("west"), true);
    assert.equal(isRegionId("lagoon"), false);
    assert.equal(REGIONS.length, 5);
  });
});
