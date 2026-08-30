import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { CollectTicketCard } from "@/components/kibaz/collect-ticket-card";
import { QrScanner } from "@/components/kibaz/qr-scanner";
import { Masthead } from "@/components/kibaz/masthead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findTicketByRef } from "@/lib/collect-ticket";
import { parseTicketQr, type ParsedTicketQr } from "@/lib/ticket-qr";
import { useMeStore, type LocalOrder } from "@/lib/me-store";
import { formatMur } from "@/lib/utils";

export const Route = createFileRoute("/scan")({ component: ScanPage });

type Hit = {
  parsed: ParsedTicketQr;
  order: LocalOrder | null;
};

function readHit(text: string, orders: LocalOrder[]): Hit | null {
  const parsed = parseTicketQr(text);
  if (!parsed) return null;
  return { parsed, order: findTicketByRef(orders, parsed.ref) };
}

function ScanPage() {
  const orders = useMeStore((s) => s.orders);
  const sticker = useMeStore((s) => s.sticker);
  const markCollected = useMeStore((s) => s.markCollected);
  const [hydrated, setHydrated] = useState(false);
  const [hit, setHit] = useState<Hit | null>(null);
  const [miss, setMiss] = useState<string | null>(null);

  useEffect(() => {
    const unsub = useMeStore.persist.onFinishHydration(() => setHydrated(true));
    if (useMeStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  const onDetect = useCallback((text: string) => {
    const next = readHit(text, useMeStore.getState().orders);
    if (!next) return;
    setMiss(null);
    setHit((current) => current ?? next);
  }, []);

  function lookupTyped(raw: string) {
    const value = raw.trim();
    const ordersNow = useMeStore.getState().orders;
    const next = readHit(value, ordersNow) ?? readHit(`KIBAZ ${value.toUpperCase()}`, ordersNow);
    if (!next) {
      setMiss("No ticket with that ref.");
      return;
    }
    setMiss(null);
    setHit(next);
  }

  const liveOrder = hit?.order ? orders.find((order) => order.id === hit.order?.id) ?? hit.order : null;

  return (
    <main>
      <Masthead title="Scan" kicker="Counter camera" />

      <div className="px-4 pb-8 pt-2">
        {!hit ? (
          <>
            <QrScanner active={hydrated && !hit} onDetect={onDetect} />
            <p className="mt-4 text-sm text-muted">Staff view. The diner holds the stub; you point the camera.</p>
            <form
              className="mt-6 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                lookupTyped(String(data.get("ref") ?? ""));
              }}
            >
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Or type the ref</span>
                <Input
                  name="ref"
                  placeholder="KBZ-7K2M"
                  aria-label="Ticket ref"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  className="uppercase"
                />
              </label>
              <Button type="submit" variant="secondary" className="w-full">
                Look up
              </Button>
            </form>
            {miss ? <p className="mt-3 text-sm text-danger">{miss}</p> : null}
          </>
        ) : (
          <div className="space-y-4">
            {liveOrder ? (
              <CollectTicketCard order={liveOrder} sticker={sticker} forCounter />
            ) : (
              <ParsedStub parsed={hit.parsed} />
            )}
            {liveOrder?.status === "asked" ? (
              <Button className="w-full" onClick={() => markCollected(liveOrder.id)}>
                Handed over
              </Button>
            ) : (
              <p className="text-center text-sm font-medium text-success">
                {liveOrder ? "Collected." : "Not stored on this phone. Still good to hand over."}
              </p>
            )}
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setHit(null);
                setMiss(null);
              }}
            >
              Scan another
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/shop">Back to Shop</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

function ParsedStub({ parsed }: { parsed: ParsedTicketQr }) {
  return (
    <article className="rounded-card bg-card p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Scanned stub</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-wide">{parsed.ref}</h1>
      <p className="mt-3 font-display text-base font-semibold">{parsed.dinerName}</p>
      {parsed.shopName ? <p className="text-sm text-muted">{parsed.shopName}</p> : null}
      {parsed.collectionPoint ? <p className="mt-1 text-sm text-ink-2">{parsed.collectionPoint}</p> : null}
      {parsed.lines.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm">
          {parsed.lines.map((line) => (
            <li key={`${line.qty}-${line.name}`}>
              {line.qty} × {line.name}
            </li>
          ))}
        </ul>
      ) : null}
      {typeof parsed.totalMur === "number" ? (
        <p className="mt-3 font-display font-semibold tabular-nums">{formatMur(parsed.totalMur)}</p>
      ) : null}
    </article>
  );
}
