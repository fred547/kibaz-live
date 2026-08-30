import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, BookmarkCheck, Crown, MapPinned } from "lucide-react";
import { loadCatalogSafe } from "@/lib/catalog";
import { placeById } from "@/lib/kibaz-data";
import { regionIdForArea } from "@/lib/island";
import { useMeStore } from "@/lib/me-store";
import { formatMur } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StickerAvatar } from "@/components/kibaz/sticker-avatar";

export const Route = createFileRoute("/place/$id")({
  loader: () => loadCatalogSafe(),
  component: PlaceSheet,
});

function PlaceSheet() {
  const { id } = Route.useParams();
  const catalog = Route.useLoaderData();
  const place = placeById(catalog.places, id);
  const saved = useMeStore((s) => s.savedPlaceIds.includes(id));
  const crowned = useMeStore((s) => s.crownedPlaceIds.includes(id));
  const toggleSaved = useMeStore((s) => s.toggleSaved);
  const toggleCrown = useMeStore((s) => s.toggleCrown);

  if (!place) {
    return (
      <main className="px-4 py-10">
        <p className="font-display text-lg font-semibold">That place isn't on the list.</p>
        <Link to="/" className="mt-3 inline-flex min-h-11 items-center text-sm text-coral-deep">
          Back to Discover
        </Link>
      </main>
    );
  }

  const friends = place.trustedBy
    .map((friendId) => catalog.friends.find((friend) => friend.id === friendId) ?? null)
    .filter((f) => f !== null);
  const region = regionIdForArea(place.area);

  return (
    <main>
      <header className="relative">
        <img src={place.photo} alt="" className="aspect-video w-full object-cover" />
        <Link
          to="/"
          aria-label="Back to Discover"
          className="absolute left-3 top-3 inline-flex size-11 items-center justify-center rounded-full bg-card/90 text-ink shadow-card"
        >
          <ArrowLeft className="size-5" />
        </Link>
      </header>

      <div className="px-4 py-5">
        <p className="text-sm text-muted">
          {place.area}
          {place.kind === "street" ? " · Street" : ""}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">{place.name}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{place.blurb}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1 text-ink">
            <Crown className="size-4 text-crown" />
            <span className="tabular-nums font-medium">{place.crowns + (crowned ? 1 : 0)}</span>
            <span>Kibaz</span>
          </span>
          {place.google ? (
            <span className="tabular-nums">
              Google {place.google.score.toFixed(1)} · {place.google.count}
            </span>
          ) : null}
        </div>
        {place.kitchenCount ? (
          <p className="mt-2 text-sm text-muted">{place.kitchenCount} kitchens · order from your seat</p>
        ) : null}

        {friends.length > 0 ? (
          <div className="mt-4 flex items-center gap-2">
            {friends.map((friend) => (
              <StickerAvatar key={friend.id} name={friend.name} sticker={friend.sticker} size="sm" />
            ))}
            <p className="text-sm text-muted">
              {friends.map((f) => f.name).join(", ")} passed this on.
            </p>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant={crowned ? "tint" : "primary"} onClick={() => toggleCrown(place.id)}>
            <Crown className="size-4" />
            {crowned ? "Crowned" : "Crown this"}
          </Button>
          <Button variant="secondary" onClick={() => toggleSaved(place.id)}>
            {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
        {region ? (
          <Button variant="ghost" className="mt-2 w-full" asChild>
            <Link to="/map" search={{ region }}>
              <MapPinned className="size-4" />
              Show on the island
            </Link>
          </Button>
        ) : null}
      </div>

      <section className="px-4 pb-8">
        <h2 className="mb-3 font-display text-lg font-semibold">What to order</h2>
        <div className="space-y-2">
          {place.dishes.map((dish) => (
            <article key={dish.id} className="flex items-center gap-3 rounded-card bg-card p-2 shadow-card">
              <img src={dish.photo} alt="" className="size-20 shrink-0 rounded-sm object-cover" />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-sm font-semibold">{dish.name}</h3>
                <p className="mt-0.5 text-xs text-muted">{dish.note}</p>
                {dish.priceMur ? (
                  <p className="mt-1 font-display text-sm font-semibold tabular-nums">
                    {formatMur(dish.priceMur)}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          Ratings and photos from Google. Crowns are Kibaz. Public is positives only.
        </p>
      </section>
    </main>
  );
}
