import assert from "node:assert/strict";
import { describe, it } from "node:test";
import jsQR from "jsqr";
import { parseTicketQr, ticketQrMatrix, ticketQrPayload } from "./ticket-qr.ts";

function raster(matrix: { size: number; data: boolean[][] }) {
  const scale = 8;
  const size = matrix.size * scale;
  const pixels = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < matrix.size; y += 1) {
    for (let x = 0; x < matrix.size; x += 1) {
      const ink = matrix.data[y]?.[x] ? 0 : 255;
      for (let dy = 0; dy < scale; dy += 1) {
        for (let dx = 0; dx < scale; dx += 1) {
          const i = ((y * scale + dy) * size + (x * scale + dx)) * 4;
          pixels[i] = ink;
          pixels[i + 1] = ink;
          pixels[i + 2] = ink;
          pixels[i + 3] = 255;
        }
      }
    }
  }
  return { pixels, size };
}

describe("ticket QR", () => {
  it("encodes the Kibaz ref, diner, and shop for the counter", () => {
    const payload = ticketQrPayload({
      ref: "KBZ-7K2M",
      dinerName: "  Frederick  ",
      shopName: "Akiba Zone",
    });
    assert.equal(payload, "KIBAZ KBZ-7K2M\nFrederick\nAkiba Zone");
    const qr = ticketQrMatrix(payload);
    assert.ok(qr.size >= 21);
    assert.equal(qr.data.length, qr.size);
    assert.equal(qr.data[0]?.length, qr.size);
    const dark = qr.data.flat().filter(Boolean).length;
    assert.ok(dark > 40);
  });

  it("packs collection, lines, and total so another phone can fulfil", () => {
    const payload = ticketQrPayload({
      ref: "KBZ-7K2M",
      dinerName: "Frederick",
      shopName: "Akiba Zone",
      collectionPoint: "Phoenix Mall",
      lines: [{ name: "Token pack Rs 100 (3 tokens)", qty: 2, priceMur: 100 }],
      totalMur: 200,
    });
    const parsed = parseTicketQr(payload);
    assert.deepEqual(parsed, {
      ref: "KBZ-7K2M",
      dinerName: "Frederick",
      shopName: "Akiba Zone",
      collectionPoint: "Phoenix Mall",
      lines: [{ name: "Token pack Rs 100 (3 tokens)", qty: 2 }],
      totalMur: 200,
    });
  });

  it("still reads the short three-line stub", () => {
    const parsed = parseTicketQr("KIBAZ KBZ-Y6KH\nFrederick\nDelixi");
    assert.equal(parsed?.ref, "KBZ-Y6KH");
    assert.equal(parsed?.dinerName, "Frederick");
    assert.equal(parsed?.shopName, "Delixi");
    assert.equal(parsed?.lines.length, 0);
  });

  it("picks a bare KBZ ref out of a generic camera read", () => {
    const parsed = parseTicketQr("show KBZ-Y6KH at the counter");
    assert.equal(parsed?.ref, "KBZ-Y6KH");
    assert.equal(parseTicketQr("hello"), null);
  });

  it("round-trips through a camera decoder", () => {
    const payload = ticketQrPayload({
      ref: "KBZ-7K2M",
      dinerName: "Frederick",
      shopName: "Akiba Zone",
      collectionPoint: "Phoenix Mall",
      lines: [{ name: "Token pack Rs 100 (3 tokens)", qty: 1, priceMur: 100 }],
      totalMur: 100,
    });
    const { pixels, size } = raster(ticketQrMatrix(payload));
    const read = jsQR(pixels, size, size);
    assert.ok(read?.data);
    assert.equal(parseTicketQr(read.data)?.ref, "KBZ-7K2M");
    assert.equal(parseTicketQr(read.data)?.shopName, "Akiba Zone");
  });
});
