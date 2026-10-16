/**
 * Dropdown menu primitive built on Radix UI (the signed-in user menu).
 */
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;
export const DropdownMenuSeparator = (props) => (
  <DropdownPrimitive.Separator className="my-1 h-px bg-neutral-100" {...props} />
);

/** Floating menu panel. */
export function DropdownMenuContent({ className, align = "end", ...props }) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        align={align}
        sideOffset={8}
        className={cn("z-50 min-w-[11rem] rounded-xl border border-neutral-200 bg-white p-1 shadow-card", className)}
        {...props}
      />
    </DropdownPrimitive.Portal>
  );
}

/** One clickable menu entry. */
export function DropdownMenuItem({ className, ...props }) {
  return (
    <DropdownPrimitive.Item
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-800 outline-none data-[highlighted]:bg-primary-50",
        className,
      )}
      {...props}
    />
  );
}
