import { Minus, Plus } from "lucide-react";
import { formatMur } from "@/lib/utils";

export function DishCard({
  photo,
  name,
  blurb,
  priceMur,
  qty,
  onAdd,
  onInc,
  onDec,
}: {
  photo: string;
  name: string;
  blurb?: string;
  priceMur: number;
  qty: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <article className="flex items-center gap-3 rounded-card bg-card p-2 shadow-card">
      <img
        src={photo}
        alt=""
        className="size-20 shrink-0 rounded-sm object-cover"
      />
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-sm font-semibold leading-snug text-ink">{name}</h3>
        {blurb ? <p className="mt-0.5 line-clamp-2 text-xs text-muted">{blurb}</p> : null}
        <p className="mt-1 font-display text-sm font-semibold tabular-nums text-ink">
          {formatMur(priceMur)}
        </p>
      </div>
      <div className="shrink-0">
        {qty <= 0 ? (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-md bg-coral px-3 text-sm font-medium text-on-coral transition-colors duration-kibaz ease-kibaz hover:bg-coral-deep"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center gap-1 rounded-md bg-coral-tint p-1">
            <button
              type="button"
              aria-label={`Remove one ${name}`}
              onClick={onDec}
              className="inline-flex size-11 items-center justify-center rounded-sm text-coral-deep"
            >
              <Minus className="size-4" strokeWidth={2.4} />
            </button>
            <span className="min-w-6 text-center font-display text-sm font-semibold tabular-nums text-ink">
              {qty}
            </span>
            <button
              type="button"
              aria-label={`Add one ${name}`}
              onClick={onInc}
              className="inline-flex size-11 items-center justify-center rounded-sm text-coral-deep"
            >
              <Plus className="size-4" strokeWidth={2.4} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
