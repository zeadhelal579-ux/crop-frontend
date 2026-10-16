/**
 * Multi-line text input primitive (used by the support ticket form).
 */
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/** Styled <textarea>. */
const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[96px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400",
        className,
      )}
      {...props}
    />
  );
});

export { Textarea };
