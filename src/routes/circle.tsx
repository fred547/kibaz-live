import { createFileRoute, Link } from "@tanstack/react-router";
import { Masthead } from "@/components/kibaz/masthead";
import { PlaceCard, SectionHead } from "@/components/kibaz/place-card";
import { StickerAvatar } from "@/components/kibaz/sticker-avatar";
import { loadCatalogSafe } from "@/lib/catalog";
import { placeById } from "@/lib/kibaz-data";
import { useMeStore } from "@/lib/me-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/circle")({
  loader: () => loadCatalogSafe(),
  component: Circle,
});

function Circle() {
  const catalog = Route.useLoaderData();
  const crowned = useMeStore((s) => s.crownedPlaceIds);
  const toggleCrown = useMeStore((s) => s.toggleCrown);

  return (
    <main>
      <Masthead title="Circle" kicker="Recommendations from people you trust" />
      <section className="px-4 pt-2">
        <p className="text-sm text-muted">
          Know one of these? Name your favourite — two taps, from memory.
        </p>
        <div className="mt-4 space-y-4">
          {catalog.friends.map((friend) => {
            const fav = placeById(catalog.places, friend.favouritePlaceId);
            const mine = fav ? crowned.includes(fav.id) : false;
            return (
              <article key={friend.id} className="rounded-card bg-card p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <StickerAvatar name={friend.name} sticker={friend.sticker} />
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold">{friend.name}</p>
                    <p className="text-sm text-muted">{friend.note}</p>
                  </div>
                </div>
                {fav ? (
                  <div className="mt-3 space-y-3">
                    <PlaceCard place={fav} layout="row" />
                    <Button
                      variant={mine ? "tint" : "secondary"}
                      className="w-full"
                      onClick={() => toggleCrown(fav.id)}
                    >
                      {mine ? "You crowned this too" : `Crown ${fav.name}`}
                    </Button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
      <section className="px-4 py-8">
        <SectionHead title="Build your circle" />
        <p className="text-sm text-muted">
          This preview keeps friends on this device. Live Kibaz joins them by phone, quietly.
        </p>
        <Link
          to="/me"
          className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-coral-deep"
        >
          See your Me
        </Link>
      </section>
    </main>
  );
}
