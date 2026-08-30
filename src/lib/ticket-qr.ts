import { encode } from "uqr";

const REF_RE = /KBZ-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}/i;
const QTY_RE = /^(\d+)\s*[x×]\s+(.+)$/i;
const TOTAL_RE = /^Rs\s+([\d,]+)/i;

export type TicketQrInput = {
  ref: string;
  dinerName?: string;
  shopName: string;
  collectionPoint?: string;
  lines?: Array<{ name: string; qty: number; priceMur: number }>;
  totalMur?: number;
};

export type ParsedTicketQr = {
  ref: string;
  dinerName: string;
  shopName: string;
  collectionPoint?: string;
  lines: Array<{ name: string; qty: number }>;
  totalMur?: number;
};

export function ticketQrPayload(input: TicketQrInput) {
  const diner = input.dinerName?.trim() || "Guest";
  const parts = [`KIBAZ ${input.ref}`, diner, input.shopName];
  if (input.collectionPoint?.trim()) parts.push(input.collectionPoint.trim());
  for (const line of input.lines ?? []) {
    if (line.qty > 0 && line.name.trim()) parts.push(`${line.qty}× ${line.name.trim()}`);
  }
  if (typeof input.totalMur === "number") parts.push(`Rs ${input.totalMur}`);
  return parts.join("\n");
}

export function parseTicketQr(raw: string): ParsedTicketQr | null {
  const text = raw.replace(/\r\n/g, "\n").trim();
  if (!text) return null;
  const refMatch = text.match(REF_RE);
  if (!refMatch?.[0]) return null;
  const ref = refMatch[0].toUpperCase();

  const rows = text
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean);

  if (rows.length === 1) {
    return { ref, dinerName: "Guest", shopName: "", lines: [] };
  }

  const body = rows[0]?.toUpperCase().startsWith("KIBAZ") ? rows.slice(1) : rows;
  const dinerName = body[0] && !REF_RE.test(body[0]) && !QTY_RE.test(body[0]) && !TOTAL_RE.test(body[0]) ? body[0] : "Guest";
  const afterDiner = dinerName === body[0] ? body.slice(1) : body;

  let shopName = "";
  let rest = afterDiner;
  if (rest[0] && !QTY_RE.test(rest[0]) && !TOTAL_RE.test(rest[0]) && !REF_RE.test(rest[0])) {
    shopName = rest[0];
    rest = rest.slice(1);
  }

  let collectionPoint: string | undefined;
  if (rest[0] && !QTY_RE.test(rest[0]) && !TOTAL_RE.test(rest[0]) && !REF_RE.test(rest[0])) {
    collectionPoint = rest[0];
    rest = rest.slice(1);
  }

  const lines: Array<{ name: string; qty: number }> = [];
  let totalMur: number | undefined;
  for (const row of rest) {
    const qty = row.match(QTY_RE);
    if (qty) {
      lines.push({ qty: Number(qty[1]), name: qty[2]!.trim() });
      continue;
    }
    const total = row.match(TOTAL_RE);
    if (total) {
      totalMur = Number(total[1]!.replace(/,/g, ""));
    }
  }

  return { ref, dinerName, shopName, collectionPoint, lines, totalMur };
}

export function ticketQrMatrix(payload: string) {
  const qr = encode(payload, { ecc: "M", border: 2 });
  return { size: qr.size, data: qr.data };
}
