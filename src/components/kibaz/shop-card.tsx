import { Link } from "@tanstack/react-router";
import type { ShopCardView } from "@/lib/shop-place-view";
import { cn } from "@/lib/utils";

export function ShopCard({
  shop,
  layout = "hero",
}: {
  shop: ShopCardView;
  layout?: "hero" | "row";
}) {
  if (layout === "row") {
    return (
      <Link
        to="/shop/$slug"
        params={{ slug: shop.slug }}
        aria-label={shop.name}
        className="flex min-h-11 items-center gap-3 rounded-card bg-card p-2 shadow-card transition-[box-shadow] duration-kibaz ease-kibaz hover:shadow-card-hover"
      >
        <span className="size-16 shrink-0 overflow-hidden rounded-sm bg-surface-2">
          {shop.photoUrl ? (
            <img src={shop.photoUrl} alt="" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center font-display text-lg font-bold text-muted">
              {shop.name.slice(0, 1)}
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-sm font-semibold text-ink">{shop.name}</span>
          <span className="block truncate text-sm text-muted">{shop.summary ?? "Collect"}</span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      to="/shop/$slug"
      params={{ slug: shop.slug }}
      aria-label={shop.name}
      className={cn(
        "block overflow-hidden rounded-card bg-card shadow-card transition-[box-shadow] duration-kibaz ease-kibaz hover:shadow-card-hover",
      )}
    >
      <div className="relative aspect-video bg-surface-2">
        {shop.photoUrl ? (
          <img src={shop.photoUrl} alt="" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center font-display text-4xl font-bold text-muted">
            {shop.name.slice(0, 1)}
          </span>
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="font-display text-lg font-semibold text-ink">{shop.name}</p>
        {shop.summary ? <p className="text-sm text-muted">{shop.summary}</p> : null}
      </div>
    </Link>
  );
}
