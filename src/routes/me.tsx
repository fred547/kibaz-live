import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { STICKER_SRC, getPlace, type StickerKey } from "@/lib/kibaz-data";
import { ticketRef } from "@/lib/collect-ticket";
import { useMeStore } from "@/lib/me-store";
import { formatMur, initialsFromName } from "@/lib/utils";
import { PlaceCard, SectionHead } from "@/components/kibaz/place-card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/me")({ component: Me });

const STICKERS: StickerKey[] = ["sleepy", "hungry", "mango", "crown"];

function Me() {
  const name = useMeStore((s) => s.name);
  const sticker = useMeStore((s) => s.sticker);
  const setName = useMeStore((s) => s.setName);
  const setSticker = useMeStore((s) => s.setSticker);
  const savedPlaceIds = useMeStore((s) => s.savedPlaceIds);
  const crownedPlaceIds = useMeStore((s) => s.crownedPlaceIds);
  const orders = useMeStore((s) => s.orders);
  const saved = savedPlaceIds.map(getPlace).filter((p) => p !== null);
  const crowned = crownedPlaceIds.map(getPlace).filter((p) => p !== null);
  const [stickerBroken, setStickerBroken] = useState(false);

  return (
    <main>
      <header className="px-4 pb-2 pt-6">
        <div className="flex items-center gap-4">
          <span className="relative inline-flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-coral-tint text-base font-semibold text-coral-deep">
            {stickerBroken ? (
              initialsFromName(name)
            ) : (
              <img
                src={STICKER_SRC[sticker]}
                alt=""
                className="size-full object-contain"
                onError={() => setStickerBroken(true)}
              />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-wordmark text-sm font-bold text-muted">kibaz</p>
            <Input
              aria-label="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 h-11 border-0 bg-transparent px-0 font-display text-xl font-semibold shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
      </header>

      <section className="px-4 pt-4">
        <SectionHead title="Your face" />
        <div className="flex gap-3">
          {STICKERS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setStickerBroken(false);
                setSticker(key);
              }}
              aria-label={`Use ${key} sticker`}
              aria-pressed={sticker === key}
              className={`size-16 overflow-hidden rounded-full bg-surface-2 ring-2 ${
                sticker === key ? "ring-coral" : "ring-transparent"
              }`}
            >
              <img src={STICKER_SRC[key]} alt="" className="size-full object-contain" />
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 pt-8">
        <SectionHead title="Crowned" />
        {crowned.length === 0 ? (
          <p className="text-sm text-muted">Nothing crowned yet. Pass on a place from Circle.</p>
        ) : (
          <div className="space-y-2">
            {crowned.map((place) => (
              <PlaceCard key={place.id} place={place} layout="row" />
            ))}
          </div>
        )}
      </section>

      <section className="px-4 pt-8">
        <SectionHead title="Saved" />
        {saved.length === 0 ? (
          <p className="text-sm text-muted">Nothing saved. Open a place and keep it for later.</p>
        ) : (
          <div className="space-y-2">
            {saved.map((place) => (
              <PlaceCard key={place.id} place={place} layout="row" />
            ))}
          </div>
        )}
      </section>

      <section className="px-4 py-8">
        <SectionHead
          title="Asked to collect"
          action={
            <Link to="/scan" className="text-sm font-medium text-coral-deep">
              Scan
            </Link>
          }
        />
        {orders.length === 0 ? (
          <p className="text-sm text-muted">
            Shop carts stay per storefront. Ask Delixi or Akiba to collect — then hold the ticket at the counter.
          </p>
        ) : (
          <ul className="space-y-2">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  to="/ticket/$id"
                  params={{ id: order.id }}
                  className="block rounded-card bg-card p-4 shadow-card"
                >
                  <p className="font-display text-xs font-semibold tracking-wide text-coral-deep">
                    {ticketRef(order)}
                    {order.status === "collected" ? " · collected" : ""}
                  </p>
                  <p className="mt-1 font-display font-semibold">{order.shopName}</p>
                  <p className="text-sm text-muted">{order.collectionPoint}</p>
                  <p className="mt-1 text-sm tabular-nums text-ink-2">{formatMur(order.totalMur)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
