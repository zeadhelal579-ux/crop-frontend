/**
 * Button primitive (shadcn/ui pattern). Variants follow the Figma style
 * guide: Primary, Secondary, Inverted and Outlined, plus Danger and Ghost.
 */
import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-800",
        secondary: "bg-surface-muted text-neutral-800 hover:bg-neutral-100",
        inverted: "bg-neutral-800 text-white hover:bg-neutral-900",
        outlined: "border border-neutral-300 bg-transparent text-neutral-800 hover:bg-neutral-50",
        danger: "bg-risk-high text-white hover:opacity-90",
        ghost: "text-neutral-700 hover:bg-neutral-100",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-5",
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

/** Render a styled <button>; variant and size come from the design tokens above. */
const Button = forwardRef(function Button({ className, variant, size, type = "button", ...props }, ref) {
  return <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});

export { Button };
