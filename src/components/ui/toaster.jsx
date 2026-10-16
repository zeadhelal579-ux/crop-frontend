/**
 * Renders the toast queue in the bottom corner of the screen.
 */
import { cn } from "@/lib/utils";
import { useToastStore } from "./use-toast";

/** Mounted once inside AppShell. */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  return (
    <div className="pointer-events-none fixed bottom-4 end-4 z-[60] flex w-80 max-w-[90vw] flex-col gap-2" role="status">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={cn(
            "pointer-events-auto rounded-2xl border px-4 py-3 shadow-card",
            item.variant === "error" ? "border-risk-high bg-risk-highBg text-risk-high" : "border-secondary-300 bg-white text-neutral-800",
          )}
        >
          <p className="text-sm font-semibold">{item.title}</p>
          {item.description ? <p className="mt-0.5 text-xs opacity-80">{item.description}</p> : null}
        </div>
      ))}
    </div>
  );
}
