/**
 * Accordion primitive built on Radix UI (the Help screen FAQ list).
 */
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

/** One expandable row. */
export function AccordionItem({ className, ...props }) {
  return <AccordionPrimitive.Item className={cn("rounded-2xl bg-white/80", className)} {...props} />;
}

/** The clickable question line with a rotating chevron. */
export function AccordionTrigger({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between gap-3 px-4 py-3 text-start text-sm font-semibold text-neutral-800",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className="h-4 w-4 shrink-0 text-neutral-500 transition-transform group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/** The collapsible answer area. */
export function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content className="overflow-hidden text-sm text-neutral-600" {...props}>
      <div className={cn("px-4 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
