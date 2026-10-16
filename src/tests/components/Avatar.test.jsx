/** Tests for the Avatar primitive: initials, profile picture and the fallback when the picture fails. */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, getInitials } from "@/components/ui/avatar";

describe("Avatar", () => {
  it("builds up to two initials from a name", () => {
    expect(getInitials("Sally Hassan")).toBe("SH");
    expect(getInitials("Mona")).toBe("M");
    expect(getInitials("")).toBe("");
  });

  it("shows the initials when there is no picture", () => {
    render(<Avatar name="Sally Hassan" />);
    expect(screen.getByText("SH")).toBeInTheDocument();
  });

  it("shows the picture without a referrer, and falls back to initials if it fails to load", () => {
    const { container } = render(<Avatar name="Sally Hassan" imageUrl="https://example.com/me.jpg" />);
    const image = container.querySelector("img");
    expect(image).toHaveAttribute("src", "https://example.com/me.jpg");
    expect(image).toHaveAttribute("referrerpolicy", "no-referrer");
    fireEvent.error(image);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("SH")).toBeInTheDocument();
  });
});
