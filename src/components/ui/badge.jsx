/**
 * Badge: a small rounded pill. Colours are passed in by the caller (via
 * utils/riskColor.js or utils/vigorColor.js) because the same shape repeats
 * with many different colours across the design.
 */
import { cn } from "@/lib/utils";

/** Render an inline pill label. */
export function Badge({ className, ...props }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold", className)}
      {...props}
    />
  );
}
