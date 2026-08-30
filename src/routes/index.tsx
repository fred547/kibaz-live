import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPinned, Play, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { IslandMark } from "@/components/kibaz/island-map";
import { Masthead } from "@/components/kibaz/masthead";
import { PlaceCard, SectionHead } from "@/components/kibaz/place-card";
import { StickerAvatar } from "@/components/kibaz/sticker-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadCatalogSafe } from "@/lib/catalog";
import { ON_AIR, STREET_BITES, placeById, viewsFromPlaces } from "@/lib/kibaz-data";

export const Route = createFileRoute("/")({
  loader: () => loadCatalogSafe(),
  component: Discover,
});

function Discover() {
  const catalog = Route.useLoaderData();
  const { trusted, google, foodCourts, topDishes } = viewsFromPlaces(catalog.places);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return catalog.places.filter(
      (place) =>
        place.name.toLowerCase().includes(q) ||
        place.area.toLowerCase().includes(q) ||
        place.dishes.some((dish) => dish.name.toLowerCase().includes(q)),
    );
  }, [query, catalog.places]);

  return (
    <main>
      <Masthead
        title="Discover"
        kicker="Find your next place to eat"
        end={
          <Button variant="ghost" size="icon" asChild>
            <Link to="/map" aria-label="Map of the island">
              <MapPinned className="size-5" />
            </Link>
          </Button>
        }
      />

      <div className="px-4 pb-2">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ki baz zordi?"
            aria-label="Search places"
            className="pl-10"
          />
        </label>
      </div>

      {query.trim() ? (
        <section className="px-4 py-4">
          <SectionHead title={filtered.length ? "Matches" : "Nothing with that name"} />
          {filtered.length === 0 ? (
            <p className="text-sm text-muted">Try a place, a town, or a dish. Only good travels.</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((place) => (
                <PlaceCard key={place.id} place={place} layout="row" />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="px-4 pt-4">
            <SectionHead title="Your circle" />
            <div className="flex gap-4 overflow-x-auto hide-scroll pb-1">
              {catalog.friends.map((friend) => {
                const fav = placeById(catalog.places, friend.favouritePlaceId);
                return (
                  <Link
                    key={friend.id}
                    to="/circle"
                    className="flex w-16 shrink-0 flex-col items-center gap-2 text-center"
                  >
                    <StickerAvatar name={friend.name} sticker={friend.sticker} size="md" />
                    <span className="w-full truncate text-xs font-medium text-ink">{friend.name}</span>
                    {fav ? (
                      <span className="w-full truncate text-xs text-muted">{fav.name}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="px-4 pt-8">
            <Link
              to="/map"
              className="flex min-h-16 items-center gap-4 rounded-card bg-card p-3 shadow-card"
            >
              <IslandMark className="h-14 w-10 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block font-display text-sm font-semibold text-ink">On the island</span>
                <span className="block text-sm text-muted">Tap a town. See what's good there.</span>
              </span>
              <MapPinned className="size-5 shrink-0 text-coral-deep" />
            </Link>
          </section>

          <section className="px-4 pt-8">
            <SectionHead title="Street · still hot" />
            <div className="flex gap-3 overflow-x-auto hide-scroll pb-1">
              {STREET_BITES.map((bite) => (
                <Link
                  key={bite.id}
                  to="/place/$id"
                  params={{ id: bite.placeId }}
                  className="w-44 shrink-0 overflow-hidden rounded-card bg-card shadow-card"
                >
                  <img src={bite.photo} alt="" className="aspect-square w-full object-cover" />
                  <span className="block p-3">
                    <span className="block font-display text-sm font-semibold leading-snug">{bite.name}</span>
                    <span className="block text-xs text-muted">{bite.note}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="px-4 pt-8">
            <SectionHead title="From people you trust" />
            <div className="flex gap-3 overflow-x-auto hide-scroll pb-1">
              {trusted.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </section>

          <section className="px-4 pt-8">
            <SectionHead title="Latest from the tables" />
            <div className="flex gap-3 overflow-x-auto hide-scroll pb-1">
              {ON_AIR.map((clip) => (
                <Link
                  key={clip.id}
                  to="/place/$id"
                  params={{ id: clip.placeId }}
                  className="relative w-56 shrink-0 overflow-hidden rounded-card bg-ink shadow-card"
                >
                  <img src={clip.photo} alt="" className="aspect-video w-full object-cover opacity-90" />
                  <span className="absolute left-3 top-3 inline-flex size-11 items-center justify-center rounded-full bg-card/90 text-ink">
                    <Play className="size-4 translate-x-px" fill="currentColor" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 bg-ink/70 p-3 text-card">
                    <span className="block text-sm font-medium">{clip.title}</span>
                    <span className="block text-xs text-card/80">{clip.caption}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="px-4 pt-8">
            <SectionHead title="Top dishes · Mauritius" />
            <div className="flex gap-3 overflow-x-auto hide-scroll pb-1">
              {topDishes.slice(0, 8).map((dish) => (
                <Link
                  key={`${dish.place.id}-${dish.id}`}
                  to="/place/$id"
                  params={{ id: dish.place.id }}
                  className="w-40 shrink-0 overflow-hidden rounded-card bg-card shadow-card"
                >
                  <img src={dish.photo} alt="" className="aspect-square w-full object-cover" />
                  <span className="block p-3">
                    <span className="block font-display text-sm font-semibold leading-snug">{dish.name}</span>
                    <span className="block text-xs text-muted">{dish.place.name}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="px-4 pt-8">
            <SectionHead title="Well reviewed on Google" />
            <p className="mb-3 text-xs text-muted">
              Ratings and photos from Google. Crowns are Kibaz.
            </p>
            <div className="space-y-2">
              {google.map((place) => (
                <PlaceCard key={place.id} place={place} layout="row" />
              ))}
            </div>
          </section>

          <section className="px-4 py-8">
            <SectionHead title="Food courts" />
            {foodCourts.map((place) => (
              <Link
                key={place.id}
                to="/place/$id"
                params={{ id: place.id }}
                className="block overflow-hidden rounded-card bg-card shadow-card"
              >
                <img src={place.photo} alt="" className="aspect-video w-full object-cover" />
                <span className="block p-4">
                  <span className="block font-display text-base font-semibold">{place.name}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {place.area} · {place.kitchenCount} kitchens · {place.blurb}
                  </span>
                </span>
              </Link>
            ))}
          </section>
        </>
      )}
    </main>
  );
}