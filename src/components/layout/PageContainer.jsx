/**
 * Centres page content and applies the shared horizontal padding.
 */
import { cn } from "@/lib/utils";

/** Wrap a page section so every screen shares the same width and gutters. */
export function PageContainer({ className, ...props }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6", className)} {...props} />;
}
