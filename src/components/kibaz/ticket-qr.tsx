import { useMemo } from "react";
import { ticketQrMatrix } from "@/lib/ticket-qr";

export function TicketQr({ payload, label }: { payload: string; label: string }) {
  const { size, data, path } = useMemo(() => {
    const qr = ticketQrMatrix(payload);
    const d = qr.data
      .flatMap((row, y) => row.flatMap((on, x) => (on ? [`M${x} ${y}h1v1h-1z`] : [])))
      .join("");
    return { size: qr.size, data: qr.data, path: d };
  }, [payload]);

  if (data.length === 0) return null;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="size-full text-ink"
      role="img"
      aria-label={label}
    >
      <rect width={size} height={size} fill="var(--color-cream)" />
      <path d={path} fill="currentColor" />
    </svg>
  );
}
