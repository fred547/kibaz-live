import type { ReactNode } from "react";
import { KibazMark } from "./kibaz-mark";

export function Masthead({
  kicker,
  title,
  end,
}: {
  kicker?: string;
  title: string;
  end?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 bg-cream/95 px-4 py-3 backdrop-blur-sm">
      <KibazMark className="size-8" />
      <div className="min-w-0 flex-1">
        <p className="font-wordmark text-xl font-bold leading-none tracking-tight text-ink">kibaz</p>
        {kicker ? <p className="mt-1 text-xs text-muted">{kicker}</p> : null}
      </div>
      {end}
      <h1 className="sr-only">{title}</h1>
    </header>
  );
}
