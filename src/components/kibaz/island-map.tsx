import { PLACES, SHOPS } from "@/lib/kibaz-data";
import {
  REGIONS,
  placesInRegion,
  shopsInRegion,
  type RegionId,
} from "@/lib/island";
import { cn } from "@/lib/utils";

const ISLAND =
  "M50 9C58 8 66 14 70 22C75 32 78 42 80 54C82 66 84 78 82 90C80 102 78 112 74 118C70 124 64 128 56 130C48 132 40 130 34 124C28 118 18 120 16 114C14 108 20 104 22 98C20 88 16 80 17 70C18 60 16 52 20 46C24 40 22 34 26 28C32 18 42 10 50 9Z";

const REEF =
  "M50 4C60 3 70 11 75 22C81 34 85 46 86 60C87 74 89 88 86 102C83 116 78 126 70 132C60 138 46 138 36 132C26 126 14 126 10 118C6 110 12 102 16 94C12 82 8 72 10 60C12 48 10 38 16 28C24 14 38 5 50 4Z";

export function IslandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 140"
      className={cn("text-ink", className)}
      aria-hidden
    >
      <path d={REEF} fill="var(--color-surface-2)" />
      <path d={ISLAND} fill="var(--color-card)" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function IslandMap({
  selectedId,
  onSelect,
  places = PLACES,
  shops = SHOPS,
}: {
  selectedId?: RegionId | null;
  onSelect?: (id: RegionId) => void;
  places?: { area: string }[];
  shops?: { slug: string }[];
}) {
  return (
    <div className="relative mx-auto w-full max-w-64">
      <svg
        viewBox="0 0 100 140"
        className="w-full text-ink"
        role="img"
        aria-label="Map of Mauritius"
      >
        <path d={REEF} fill="var(--color-surface-2)" opacity="0.7" />
        <path d={ISLAND} fill="var(--color-card)" stroke="currentColor" strokeWidth="0.8" />
      </svg>
      {REGIONS.map((region) => {
        const count = placesInRegion(places, region.id).length + shopsInRegion(shops, region.id).length;
        const selected = selectedId === region.id;
        return (
          <button
            key={region.id}
            type="button"
            onClick={() => onSelect?.(region.id)}
            aria-pressed={selected}
            aria-label={`${region.label}, ${count} spots`}
            className="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${region.x}%`, top: `${(region.y / 140) * 100}%` }}
          >
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-pill text-xs font-semibold tabular-nums shadow-card transition-[transform,background-color,color] duration-kibaz ease-kibaz",
                selected
                  ? "scale-110 bg-coral-deep text-on-coral ring-2 ring-ink"
                  : "bg-coral text-on-coral",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}