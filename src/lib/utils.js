/**
 * Shared class-name helper used by every UI component.
 * clsx resolves conditional class lists, tailwind-merge removes conflicts.
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge class names, letting later Tailwind utilities override earlier ones. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
