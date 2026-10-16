/**
 * Progress bar primitive (crop phenology and GDD progress bars).
 */
import { cn } from "@/lib/utils";

/** Horizontal bar filled to value percent; the fill colour is set by the caller. */
export function Progress({ value, className, indicatorClassName }) {
  const percent = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-neutral-200", className)}
    >
      <div className={cn("h-full rounded-full bg-primary", indicatorClassName)} style={{ width: `${percent}%` }} />
    </div>
  );
}
