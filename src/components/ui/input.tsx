import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-line bg-card px-4 text-base text-ink placeholder:text-muted shadow-card transition-[border-color,box-shadow] duration-kibaz ease-kibaz focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40",
        className,
      )}
      {...props}
    />
  );
}
