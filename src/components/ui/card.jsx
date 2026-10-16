/**
 * Card primitives: a translucent light surface used for every dashboard panel.
 */
import { cn } from "@/lib/utils";

/** Outer card surface. */
export function Card({ className, ...props }) {
  return <div className={cn("glass-card", className)} {...props} />;
}

/** Card title row (title on the start side, actions on the end side). */
export function CardHeader({ className, ...props }) {
  return <div className={cn("flex items-start justify-between gap-3 p-5 pb-2", className)} {...props} />;
}

/** Card heading text. */
export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-lg font-bold text-neutral-800", className)} {...props} />;
}

/** Card body wrapper. */
export function CardContent({ className, ...props }) {
  return <div className={cn("p-5 pt-2", className)} {...props} />;
}
