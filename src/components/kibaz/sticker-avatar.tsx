import { STICKER_SRC, type StickerKey } from "@/lib/kibaz-data";
import { cn, initialsFromName } from "@/lib/utils";

export function StickerAvatar({
  name,
  sticker,
  size = "md",
}: {
  name: string;
  sticker?: StickerKey | null;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? "size-16" : size === "sm" ? "size-10" : "size-14";
  const src = sticker ? STICKER_SRC[sticker] : null;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-coral-tint text-sm font-semibold text-coral-deep",
        dim,
      )}
      aria-hidden
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="size-full object-contain"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        initialsFromName(name)
      )}
    </span>
  );
}
