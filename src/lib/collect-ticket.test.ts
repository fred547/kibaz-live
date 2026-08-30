import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCollectTicket,
  findTicket,
  findTicketByRef,
  formatTicketWhen,
  makeCollectRef,
  ticketLinesTotal,
  ticketRef,
} from "./collect-ticket.ts";

const createdAt = "2026-08-30T15:17:00.000Z";

describe("collect ticket", () => {
  it("mints a stable KBZ ref from storefront and time", () => {
    const delixi = makeCollectRef({ storefrontId: "sf_delixi", createdAt });
    const again = makeCollectRef({ storefrontId: "sf_delixi", createdAt });
    const akiba = makeCollectRef({ storefrontId: "sf_akiba", createdAt });
    assert.match(delixi, /^KBZ-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/);
    assert.equal(delixi, again);
    assert.notEqual(delixi, akiba);
  });

  it("refuses an empty cart so Shop cannot mint a blank stub", () => {
    assert.equal(
      buildCollectTicket({
        storefrontId: "sf_akiba",
        slug: "akiba",
        shopName: "Akiba Zone",
        collectionPoint: "Phoenix Mall",
        dinerName: "Frederick",
        lines: [{ sku: "AKIBA-TOK-100", name: "Token pack Rs 100 (3 tokens)", qty: 0, priceMur: 100 }],
        createdAt,
      }),
      null,
    );
  });

  it("snapshots diner, collection, lines, and total for the counter", () => {
    const ticket = buildCollectTicket({
      storefrontId: "sf_akiba",
      slug: "akiba",
      shopName: "Akiba Zone",
      collectionPoint: "Phoenix Mall",
      collectionAddress: "Akiba Zone, Phoenix Mall",
      dinerName: "  Frederick  ",
      lines: [
        { sku: "AKIBA-TOK-100", name: "Token pack Rs 100 (3 tokens)", qty: 1, priceMur: 100 },
        { sku: "AKIBA-PS5-SOLO-1H", name: "1 Controller + 1 PS5 (SOLO) · 1h", qty: 2, priceMur: 175 },
      ],
      createdAt,
    });
    assert.ok(ticket);
    assert.equal(ticket.dinerName, "Frederick");
    assert.equal(ticket.shopName, "Akiba Zone");
    assert.equal(ticket.collectionPoint, "Phoenix Mall");
    assert.equal(ticket.collectionAddress, "Akiba Zone, Phoenix Mall");
    assert.equal(ticket.status, "asked");
    assert.equal(ticket.totalMur, 450);
    assert.equal(ticketLinesTotal(ticket.lines), 450);
    assert.equal(ticket.ref, makeCollectRef({ storefrontId: "sf_akiba", createdAt }));
    assert.equal(ticket.id, "sf_akiba-1788103020000");
  });

  it("finds a ticket by id and recovers a missing ref from old Me rows", () => {
    const ticket = buildCollectTicket({
      storefrontId: "sf_delixi",
      slug: "delixi",
      shopName: "Delixi",
      collectionPoint: "Rose Hill counter",
      dinerName: "Frederick",
      lines: [{ sku: "DX3-001", name: "DX3 MCB 32A", qty: 2, priceMur: 245 }],
      createdAt,
    });
    assert.ok(ticket);
    assert.equal(findTicket([ticket], ticket.id)?.shopName, "Delixi");
    const legacy = { ...ticket, ref: undefined };
    assert.equal(ticketRef(legacy), makeCollectRef({ storefrontId: "sf_delixi", createdAt }));
  });

  it("prints Mauritius wall time on the stub", () => {
    assert.equal(formatTicketWhen(createdAt), "30 Aug · 19:17");
  });

  it("finds a stub by KBZ ref", () => {
    const ticket = buildCollectTicket({
      storefrontId: "sf_akiba",
      slug: "akiba",
      shopName: "Akiba Zone",
      collectionPoint: "Phoenix Mall",
      dinerName: "Frederick",
      lines: [{ sku: "AKIBA-TOK-100", name: "Token pack Rs 100 (3 tokens)", qty: 1, priceMur: 100 }],
      createdAt,
    });
    assert.ok(ticket);
    assert.equal(findTicketByRef([ticket], ticket.ref ?? "")?.id, ticket.id);
    assert.equal(findTicketByRef([ticket], "kbz-nope"), null);
  });
});
