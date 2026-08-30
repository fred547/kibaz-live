import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { IslandMap } from "@/components/kibaz/island-map";
import { Masthead } from "@/components/kibaz/masthead";
import { PlaceCard, SectionHead } from "@/components/kibaz/place-card";
import { ShopCard } from "@/components/kibaz/shop-card";
import { loadCatalogSafe } from "@/lib/catalog";
import {
  REGIONS,
  isRegionId,
  placesInRegion,
  regionById,
  shopsInRegion,
  type RegionId,
} from "@/lib/island";
import { shopCardsFrom } from "@/lib/kibaz-data";

type MapSearch = { region?: string };

export const Route = createFileRoute("/map")({
  validateSearch: (raw: Record<string, unknown>): MapSearch => ({
    region: typeof raw.region === "string" ? raw.region : undefined,
  }),
  loader: () => loadCatalogSafe(),
  component: IslandPage,
});

function IslandPage() {
  const { region } = Route.useSearch();
  const catalog = Route.useLoaderData();
  const cards = shopCardsFrom(catalog.shops);
  const navigate = useNavigate();
  const selected: RegionId | null = isRegionId(region) ? region : null;
  const places = selected ? placesInRegion(catalog.places, selected) : [];
  const shops = selected
    ? cards.filter((card) => shopsInRegion(catalog.shops, selected).some((shop) => shop.slug === card.slug))
    : [];
  const current = selected ? regionById(selected) : null;

  function select(id: RegionId) {
    void navigate({
      to: "/map",
      search: { region: selected === id ? undefined : id },
      replace: true,
    });
  }

  return (
    <main>
      <Masthead title="Map" kicker="Tap a town" />
      <section className="px-4 pt-2">
        <IslandMap selectedId={selected} onSelect={select} places={catalog.places} shops={catalog.shops} />
        <p className="mt-2 text-center text-sm text-muted">
          {current ? current.hint : "Five corners of the island. Numbers are spots."}
        </p>
      </section>

      <section className="px-4 py-8">
        {selected && current ? (
          <>
            <SectionHead title={current.label} />
            {shops.length > 0 ? (
              <div className="mb-3 space-y-3">
                {shops.map((shop) => (
                  <ShopCard key={shop.storefrontId} shop={shop} layout="row" />
                ))}
              </div>
            ) : null}
            {places.length > 0 ? (
              <div className="space-y-2">
                {places.map((place) => (
                  <PlaceCard key={place.id} place={place} layout="row" />
                ))}
              </div>
            ) : null}
            {places.length === 0 && shops.length === 0 ? (
              <p className="text-sm text-muted">Nothing in that town yet.</p>
            ) : null}
          </>
        ) : (
          <>
            <SectionHead title="Towns" />
            <ul className="space-y-2">
              {REGIONS.map((item) => {
                const count =
                  placesInRegion(catalog.places, item.id).length +
                  shopsInRegion(catalog.shops, item.id).length;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => select(item.id)}
                      className="flex min-h-14 w-full items-center justify-between rounded-card bg-card px-4 text-left shadow-card"
                    >
                      <span>
                        <span className="block font-display text-sm font-semibold text-ink">
                          {item.label}
                        </span>
                        <span className="block text-xs text-muted">{item.hint}</span>
                      </span>
                      <span className="tabular-nums text-sm text-coral-deep">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-center text-sm">
              <Link to="/" className="font-medium text-coral-deep">
                Back to Discover
              </Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
