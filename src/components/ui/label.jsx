/**
 * Form label primitive.
 */
import { cn } from "@/lib/utils";

/** Styled <label>; pair it with an input through htmlFor. */
export function Label({ className, ...props }) {
  return <label className={cn("text-xs font-semibold text-neutral-600", className)} {...props} />;
}
