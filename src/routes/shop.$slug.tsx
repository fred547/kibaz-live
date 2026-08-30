import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MapPin, ScanLine } from "lucide-react";
import { useMemo, useState } from "react";
import { Drawer } from "vaul";
import { DishCard } from "@/components/kibaz/dish-card";
import { Button } from "@/components/ui/button";
import { loadCatalogSafe } from "@/lib/catalog";
import { buildCollectTicket } from "@/lib/collect-ticket";
import { shopBySlug } from "@/lib/kibaz-data";
import { shopPlaceFromConfig } from "@/lib/shop-place-view";
import { cartCount, cartTotal, useCartStore } from "@/lib/cart-store";
import { useMeStore } from "@/lib/me-store";
import { formatMur } from "@/lib/utils";

export const Route = createFileRoute("/shop/$slug")({
  loader: () => loadCatalogSafe(),
  component: ShopCatalog,
});

const EMPTY_CART: Record<string, number> = {};

function ShopCatalog() {
  const { slug } = Route.useParams();
  const catalog = Route.useLoaderData();
  const navigate = useNavigate();
  const shop = shopBySlug(catalog.shops, slug);
  const place = shop
    ? shopPlaceFromConfig({
        storefrontId: shop.storefrontId,
        slug: shop.slug,
        config: {
          schemaVersion: shop.config.schemaVersion,
          locale: shop.config.locale,
          sections: [],
          brand: shop.config.brand,
          seo: shop.config.seo,
          fulfilment: shop.config.fulfilment,
        },
      })
    : null;
  const storefrontId = shop?.storefrontId ?? "";
  const cart = useCartStore((s) => s.carts[storefrontId]) ?? EMPTY_CART;
  const add = useCartStore((s) => s.add);
  const setQty = useCartStore((s) => s.setQty);
  const clear = useCartStore((s) => s.clear);
  const dinerName = useMeStore((s) => s.name);
  const addOrder = useMeStore((s) => s.addOrder);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const priceOf = useMemo(() => {
    const map = new Map<string, { name: string; priceMur: number }>();
    shop?.sections.forEach((section) => {
      section.items.forEach((item) => map.set(item.sku, item));
    });
    return map;
  }, [shop]);

  if (!shop || !place) {
    return (
      <main className="px-4 py-10">
        <p className="font-display text-lg font-semibold">That shop isn't on the list.</p>
        <Link to="/shop" className="mt-3 inline-flex min-h-11 items-center text-sm text-coral-deep">
          Back to Shop
        </Link>
      </main>
    );
  }

  const count = cartCount(cart);
  const total = cartTotal(cart, (sku) => priceOf.get(sku)?.priceMur ?? 0);
  const collection = place.collectionPoints[0];

  function askToCollect() {
    if (!shop || !place || !collection) return;
    const ticket = buildCollectTicket({
      storefrontId: shop.storefrontId,
      slug: shop.slug,
      shopName: place.name,
      collectionPoint: collection.label,
      collectionAddress: collection.addressLine,
      dinerName,
      lines: Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([sku, qty]) => {
          const item = priceOf.get(sku);
          return {
            sku,
            name: item?.name ?? sku,
            qty,
            priceMur: item?.priceMur ?? 0,
          };
        }),
      createdAt: new Date().toISOString(),
    });
    if (!ticket) return;
    addOrder(ticket);
    clear(shop.storefrontId);
    setCheckoutOpen(false);
    void navigate({ to: "/ticket/$id", params: { id: ticket.id } });
  }

  return (
    <main>
      <header className="relative">
        <div className="aspect-video bg-surface-2">
          {place.photoUrl ? (
            <img src={place.photoUrl} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center font-display text-5xl font-bold text-muted">
              {place.name.slice(0, 1)}
            </div>
          )}
        </div>
        <Link
          to="/shop"
          aria-label="Back to Shop"
          className="absolute left-3 top-3 inline-flex size-11 items-center justify-center rounded-full bg-card/90 text-ink shadow-card"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <Link
          to="/scan"
          aria-label="Scan a collect ticket"
          className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-full bg-card/90 text-ink shadow-card"
        >
          <ScanLine className="size-5" />
        </Link>
      </header>

      <div className="px-4 py-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{place.name}</h1>
        {place.summary ? <p className="mt-1 text-sm text-muted">{place.summary}</p> : null}
        {collection ? (
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink-2">
            <MapPin className="size-4" />
            Collect at {collection.label}
            {collection.addressLine ? ` · ${collection.addressLine}` : ""}
          </p>
        ) : null}
      </div>

      <div className="space-y-8 px-4 pb-28">
        {shop.sections.map((section) => (
          <section key={section.id}>
            <h2 className="mb-3 font-display text-lg font-semibold">{section.title}</h2>
            <div className="space-y-2">
              {section.items.map((item) => {
                const qty = cart[item.sku] ?? 0;
                return (
                  <DishCard
                    key={item.sku}
                    photo={item.photo}
                    name={item.name}
                    blurb={item.blurb}
                    priceMur={item.priceMur}
                    qty={qty}
                    onAdd={() => add(shop.storefrontId, item.sku, 1)}
                    onInc={() => add(shop.storefrontId, item.sku, 1)}
                    onDec={() => setQty(shop.storefrontId, item.sku, qty - 1)}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {count > 0 ? (
        <div className="fixed inset-x-0 bottom-20 z-30 mx-auto max-w-lg px-4">
          <button
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="flex h-12 w-full items-center justify-between rounded-md bg-coral px-4 text-on-coral shadow-card"
          >
            <span className="text-sm font-medium">
              {count} {count === 1 ? "item" : "items"}
            </span>
            <span className="font-display text-sm font-semibold tabular-nums">{formatMur(total)}</span>
          </button>
        </div>
      ) : null}

      <Drawer.Root open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/40" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-xl bg-card px-4 pb-10 pt-3 outline-none">
            <div className="mx-auto mb-4 h-1 w-10 rounded-pill bg-line" />
            <Drawer.Title className="font-display text-lg font-semibold">Collect</Drawer.Title>
            <Drawer.Description className="mt-1 text-sm text-muted">
              Card pay is paused. Ask to collect, then show the ticket at the counter.
            </Drawer.Description>
            <div className="mt-4 space-y-3">
              <p className="text-sm text-ink-2">
                {collection?.label}
                {collection?.addressLine ? ` · ${collection.addressLine}` : ""}
              </p>
              <ul className="space-y-2 text-sm">
                {Object.entries(cart)
                  .filter(([, qty]) => qty > 0)
                  .map(([sku, qty]) => (
                    <li key={sku} className="flex justify-between gap-3">
                      <span>
                        {qty} × {priceOf.get(sku)?.name ?? sku}
                      </span>
                      <span className="tabular-nums">
                        {formatMur((priceOf.get(sku)?.priceMur ?? 0) * qty)}
                      </span>
                    </li>
                  ))}
              </ul>
              <p className="flex justify-between font-display font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatMur(total)}</span>
              </p>
              <Button className="w-full" onClick={askToCollect}>
                Ask to collect
              </Button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </main>
  );
}
