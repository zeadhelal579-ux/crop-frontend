/** Tests for the Button primitive: variants, disabled state and click handling. */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders its label and calls onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies the primary variant by default and the danger variant on request", () => {
    render(
      <>
        <Button>Primary</Button>
        <Button variant="danger">Danger</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Primary" })).toHaveClass("bg-primary");
    expect(screen.getByRole("button", { name: "Danger" })).toHaveClass("bg-risk-high");
  });

  it("does not fire onClick while disabled", () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Locked</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Locked" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
