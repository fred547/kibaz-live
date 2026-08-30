import { Link } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import type { ReactNode } from "react";
import type { Place } from "@/lib/kibaz-data";
import { cn } from "@/lib/utils";

export function PlaceCard({
  place,
  layout = "tile",
}: {
  place: Place;
  layout?: "tile" | "row";
}) {
  if (layout === "row") {
    return (
      <Link
        to="/place/$id"
        params={{ id: place.id }}
        className="flex min-h-11 items-center gap-3 rounded-card bg-card p-2 shadow-card transition-[box-shadow,transform] duration-kibaz ease-kibaz hover:shadow-card-hover"
      >
        <img
          src={place.photo}
          alt=""
          className="size-16 shrink-0 rounded-sm object-cover"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-sm font-semibold text-ink">
            {place.name}
          </span>
          <span className="block truncate text-sm text-muted">{place.area}</span>
        </span>
        <CrownMeta place={place} />
      </Link>
    );
  }

  return (
    <Link
      to="/place/$id"
      params={{ id: place.id }}
      className="w-44 shrink-0 overflow-hidden rounded-card bg-card shadow-card transition-[box-shadow] duration-kibaz ease-kibaz hover:shadow-card-hover"
    >
      <img src={place.photo} alt="" className="aspect-video w-full object-cover" />
      <span className="block space-y-1 p-3">
        <span className="block font-display text-sm font-semibold leading-snug text-ink">
          {place.name}
        </span>
        <span className="block text-xs text-muted">{place.area}</span>
        <CrownMeta place={place} />
      </span>
    </Link>
  );
}

function CrownMeta({ place }: { place: Place }) {
  return (
    <span className="flex items-center gap-2 text-xs text-muted">
      <span className="inline-flex items-center gap-1 text-ink-2">
        <Crown className="size-3.5 text-crown" strokeWidth={2} />
        <span className="tabular-nums font-medium">{place.crowns}</span>
      </span>
      {place.google ? (
        <span className="tabular-nums">
          {place.google.score.toFixed(1)} · {place.google.count}
        </span>
      ) : null}
    </span>
  );
}

export function SectionHead({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{title}</h2>
      {action}
    </div>
  );
}
