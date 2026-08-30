import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CollectTicketCard } from "@/components/kibaz/collect-ticket-card";
import { Button } from "@/components/ui/button";
import { findTicket } from "@/lib/collect-ticket";
import { useMeStore } from "@/lib/me-store";

export const Route = createFileRoute("/ticket/$id")({ component: CollectTicketPage });

function CollectTicketPage() {
  const { id } = Route.useParams();
  const orders = useMeStore((s) => s.orders);
  const sticker = useMeStore((s) => s.sticker);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useMeStore.persist.onFinishHydration(() => setHydrated(true));
    if (useMeStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <main className="px-4 py-10">
        <p className="text-sm text-muted">Looking for your ticket…</p>
      </main>
    );
  }

  const order = findTicket(orders, id);
  if (!order) {
    return (
      <main className="px-4 py-10">
        <h1 className="font-display text-lg font-semibold">That ticket isn't here.</h1>
        <p className="mt-2 text-sm text-muted">Ask to collect from Shop, then hold the stub at the counter.</p>
        <Link to="/me" className="mt-4 inline-flex min-h-11 items-center text-sm text-coral-deep">
          Back to Me
        </Link>
      </main>
    );
  }

  return (
    <main className="px-4 pb-24 pt-6">
      <CollectTicketCard order={order} sticker={sticker} />
      <div className="mt-6 space-y-3">
        <Button className="w-full" asChild>
          <Link to="/me">Done</Link>
        </Button>
        <Button variant="secondary" className="w-full" asChild>
          <Link to="/scan">Scan at the counter</Link>
        </Button>
        <Button variant="secondary" className="w-full" asChild>
          <Link to="/shop/$slug" params={{ slug: order.slug }}>
            Back to {order.shopName}
          </Link>
        </Button>
      </div>
    </main>
  );
}
