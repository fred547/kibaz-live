import { Link } from "@tanstack/react-router";
import { Bookmark, Info, MapPinned, ScanLine, Sparkles, StickyNote, Users } from "lucide-react";
import { Drawer } from "vaul";
import { useUiStore } from "@/lib/ui-store";

const LINKS = [
  { to: "/scan" as const, label: "Scan", hint: "Counter camera. Point at a stub", icon: ScanLine },
  { to: "/map" as const, label: "Map", hint: "Tap a town on the island", icon: MapPinned },
  { to: "/circle" as const, label: "Friends", hint: "People whose palate you trust", icon: Users },
  { to: "/me" as const, label: "Saved", hint: "Places you want to try", icon: Bookmark },
  { to: "/me" as const, label: "Stickers", hint: "Your appetite face", icon: StickyNote },
];

export function MoreSheet() {
  const open = useUiStore((s) => s.moreOpen);
  const setOpen = useUiStore((s) => s.setMoreOpen);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-xl bg-card px-4 pb-10 pt-3 outline-none">
          <div className="mx-auto mb-4 h-1 w-10 rounded-pill bg-line" />
          <Drawer.Title className="font-display text-lg font-semibold text-ink">More</Drawer.Title>
          <Drawer.Description className="mt-1 text-sm text-muted">
            Quiet extras. The food stays in front.
          </Drawer.Description>
          <ul className="mt-4 space-y-1">
            {LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-center gap-3 rounded-md px-2 hover:bg-surface-2"
                  >
                    <Icon className="size-5 text-ink-2" />
                    <span>
                      <span className="block text-sm font-medium text-ink">{link.label}</span>
                      <span className="block text-xs text-muted">{link.hint}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
            <li className="flex min-h-14 items-center gap-3 rounded-md px-2 text-ink">
              <Sparkles className="size-5 text-ink-2" />
              <span>
                <span className="block text-sm font-medium">Crowns</span>
                <span className="block text-xs text-muted">
                  Crowns are Kibaz. Ratings and photos from Google.
                </span>
              </span>
            </li>
            <li className="flex min-h-14 items-center gap-3 rounded-md px-2 text-ink">
              <Info className="size-5 text-ink-2" />
              <span>
                <span className="block text-sm font-medium">About</span>
                <span className="block text-xs text-muted">
                  Ki baz? Where's the good spot. Positives only.
                </span>
              </span>
            </li>
          </ul>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
