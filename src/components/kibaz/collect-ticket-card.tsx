import { MapPin } from "lucide-react";
import type { LocalOrder } from "@/lib/me-store";
import { formatTicketWhen, ticketRef } from "@/lib/collect-ticket";
import { ticketQrPayload } from "@/lib/ticket-qr";
import { formatMur } from "@/lib/utils";
import { KibazMark } from "./kibaz-mark";
import { StickerAvatar } from "./sticker-avatar";
import { TicketQr } from "./ticket-qr";
import type { StickerKey } from "@/lib/kibaz-data";

export function CollectTicketCard({
  order,
  sticker,
  forCounter = false,
}: {
  order: LocalOrder;
  sticker?: StickerKey | null;
  forCounter?: boolean;
}) {
  const ref = ticketRef(order);
  const when = formatTicketWhen(order.createdAt);
  const diner = order.dinerName?.trim() || "Guest";

  return (
    <article className="overflow-hidden rounded-card bg-card shadow-card">
      <header className="flex items-center justify-between px-5 pt-5">
        <span className="inline-flex items-center gap-2">
          <KibazMark className="size-8" />
          <span className="font-wordmark text-sm font-bold tracking-tight">kibaz</span>
        </span>
        <span
          className={`rounded-pill px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            order.status === "collected" ? "bg-surface-2 text-success" : "bg-coral-tint text-coral-deep"
          }`}
        >
          {order.status === "collected" ? "Collected" : "Asked"}
        </span>
      </header>

      <div className="px-5 pb-2 pt-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {forCounter ? "Ticket at the counter" : "Show this at the counter"}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-wide text-ink">{ref}</h1>
        {when ? <p className="mt-2 text-sm text-muted">{when}</p> : null}
        <div className="mx-auto mt-5 size-40 overflow-hidden rounded-md bg-cream p-2">
          <TicketQr
            payload={ticketQrPayload({
              ref,
              dinerName: diner,
              shopName: order.shopName,
              collectionPoint: order.collectionPoint,
              lines: order.lines,
              totalMur: order.totalMur,
            })}
            label={`QR for ${ref}`}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          {forCounter ? "Match the name, then hand it over." : "Open Scan at the counter and point here."}
        </p>
      </div>

      <div className="mx-5 border-t border-dashed border-line" />

      <div className="flex items-center gap-3 px-5 py-4">
        <StickerAvatar name={diner} sticker={sticker} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold">{diner}</p>
          <p className="truncate text-sm text-muted">{order.shopName}</p>
        </div>
      </div>

      <div className="px-5 pb-4">
        <p className="inline-flex items-start gap-2 text-sm text-ink-2">
          <MapPin className="mt-0.5 size-4 shrink-0" />
          <span>
            Collect at {order.collectionPoint}
            {order.collectionAddress ? (
              <>
                <br />
                {order.collectionAddress}
              </>
            ) : null}
          </span>
        </p>
      </div>

      <div className="mx-5 border-t border-dashed border-line" />

      <ul className="space-y-2 px-5 py-4 text-sm">
        {order.lines.map((line) => (
          <li key={line.sku} className="flex justify-between gap-3">
            <span className="min-w-0">
              {line.qty} × {line.name}
            </span>
            <span className="shrink-0 tabular-nums text-ink-2">{formatMur(line.priceMur * line.qty)}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-end justify-between px-5 pb-2">
        <span className="font-display text-sm font-semibold">Total</span>
        <span className="font-display text-lg font-semibold tabular-nums">{formatMur(order.totalMur)}</span>
      </div>

      <p className="px-5 pb-5 text-sm text-muted">Pay at the counter. Card pay is paused.</p>
    </article>
  );
}
