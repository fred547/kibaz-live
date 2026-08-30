import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, MoreHorizontal, ShoppingBag, UserRound, Users } from "lucide-react";
import { useUiStore } from "@/lib/ui-store";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Discover", icon: Compass, match: (p: string) => p === "/" || p.startsWith("/place/") || p.startsWith("/map") },
  { to: "/shop", label: "Shop", icon: ShoppingBag, match: (p: string) => p.startsWith("/shop") || p.startsWith("/scan") },
  { to: "/circle", label: "Circle", icon: Users, match: (p: string) => p.startsWith("/circle") },
  { to: "/me", label: "Me", icon: UserRound, match: (p: string) => p.startsWith("/me") },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const setMoreOpen = useUiStore((s) => s.setMoreOpen);

  return (
    <nav
      aria-label="Kibaz"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm"
    >
      <div className="mx-auto grid w-full max-w-lg grid-cols-5">
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium",
                active ? "text-coral-deep" : "text-muted",
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium text-muted"
        >
          <MoreHorizontal className="size-5" strokeWidth={2} />
          More
        </button>
      </div>
    </nav>
  );
}
