import { cn } from "@/lib/utils";

export function KibazMark({ className, title = "Kibaz" }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-ink", className)}
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M7 5.5h14.5c3.4 0 6 2.5 6 5.8v7.2c0 3.3-2.6 5.8-6 5.8H14.2L8.4 27.8c-.7.4-1.6-.2-1.4-1l.7-2.5H7c-2.6 0-4.5-2.2-4.5-5V11.3C2.5 8 4.6 5.5 7 5.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10.4 18.2c.4 2.2 2.6 3.7 5.6 3.7s5.2-1.5 5.6-3.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M11.2 17.4h9.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M14.6 21.6v1.4M17.4 21.6v1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.2 11.4c.1-1.5.7-2.4 1.8-2.8M18 11.2c.2-1.3.9-2.1 1.9-2.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
