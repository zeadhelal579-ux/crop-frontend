/**
 * Skeleton primitive: a pulsing placeholder shown while data loads.
 */
import { cn } from "@/lib/utils";

/** Render a grey animated block; size it with className. */
export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-xl bg-neutral-200/80", className)} aria-hidden="true" />;
}
