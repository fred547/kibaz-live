import { createFileRoute, Link } from "@tanstack/react-router";
import { ScanLine, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Masthead } from "@/components/kibaz/masthead";
import { ShopCard } from "@/components/kibaz/shop-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadCatalogSafe } from "@/lib/catalog";
import { shopCardsFrom } from "@/lib/kibaz-data";

export const Route = createFileRoute("/shop/")({
  loader: () => loadCatalogSafe(),
  component: ShopHome,
});

function ShopHome() {
  const catalog = Route.useLoaderData();
  const cards = shopCardsFrom(catalog.shops);
  const [query, setQuery] = useState("");
  const shops = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(
      (shop) =>
        shop.name.toLowerCase().includes(q) ||
        shop.slug.toLowerCase().includes(q) ||
        (shop.summary ?? "").toLowerCase().includes(q),
    );
  }, [query, cards]);

  return (
    <main>
      <Masthead
        title="Shop"
        kicker="Collect. Pay at the counter."
        end={
          <Button variant="ghost" size="icon" asChild>
            <Link to="/scan" aria-label="Scan a collect ticket">
              <ScanLine className="size-5" />
            </Link>
          </Button>
        }
      />
      <div className="px-4 pb-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search shops"
            aria-label="Search shops"
            className="pl-10"
          />
        </label>
      </div>
      <section className="space-y-3 px-4 pb-8">
        {shops.length === 0 ? (
          <p className="rounded-card bg-card p-6 text-sm text-muted shadow-card">
            No shop with that name. Delixi and Akiba are the ones on the list.
          </p>
        ) : (
          shops.map((shop) => <ShopCard key={shop.storefrontId} shop={shop} />)
        )}
      </section>
    </main>
  );
}
