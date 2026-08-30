import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cartCount, cartTotal } from "./cart-store.ts";

describe("shop carts stay isolated per storefront", () => {
  it("counts and totals one bucket without mixing SKUs from another shop", () => {
    const delixi = { "DX3-001": 2 };
    const akiba = { "AKIBA-TOK-100": 1 };
    const priceOf = (sku: string) => (sku === "DX3-001" ? 245 : sku === "AKIBA-TOK-100" ? 100 : 0);

    assert.equal(cartCount(delixi), 2);
    assert.equal(cartCount(akiba), 1);
    assert.equal(cartTotal(delixi, priceOf), 490);
    assert.equal(cartTotal(akiba, priceOf), 100);
    assert.equal(cartTotal({ ...delixi, ...akiba }, priceOf), 590);
  });
});
