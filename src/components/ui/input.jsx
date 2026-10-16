/**
 * Text input primitive used by all forms.
 */
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/** Styled <input>; forwards its ref so forms can focus it. */
const Input = forwardRef(function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-800 placeholder:text-neutral-400 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});

export { Input };
