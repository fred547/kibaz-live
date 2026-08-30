import { useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useCartStore } from "@/lib/cart-store";
import { rehydrateMe } from "@/lib/me-store";
import { cn } from "@/lib/utils";
import { BottomNav } from "./bottom-nav";
import { MoreSheet } from "./more-sheet";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideNav = pathname.startsWith("/ticket/");

  useEffect(() => {
    void rehydrateMe();
    void useCartStore.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <div className={cn("mx-auto min-h-dvh w-full max-w-lg", hideNav ? "pb-16" : "pb-24")}>
        {children}
      </div>
      {hideNav ? null : <BottomNav />}
      <MoreSheet />
    </div>
  );
}
