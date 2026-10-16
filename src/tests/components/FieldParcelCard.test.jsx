/**
 * Tests for FieldParcelCard using the mock Field B-02 story: a High-risk
 * tomato parcel with an active Tuta absoluta alert and an open recommendation.
 */
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldParcelCard } from "@/components/farm/FieldParcelCard";
import { FIELDS } from "@/mocks/fixtures/farm";
import { renderWithProviders } from "../setup/renderWithProviders";

const highRiskField = { ...FIELDS[1], protocolRecommendationId: "rec-bt-b02" };
const quietField = { ...FIELDS[0], protocolRecommendationId: null };

describe("FieldParcelCard", () => {
  it("shows the alert banner and the Recommendations button for a High-risk field", () => {
    renderWithProviders(<FieldParcelCard field={highRiskField} />);
    expect(screen.getByText("High Risk")).toBeInTheDocument();
    expect(screen.getByText("Tuta absoluta Alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Recommendations" })).toBeInTheDocument();
    expect(screen.queryByText("Protocol Active")).not.toBeInTheDocument();
  });

  it("hides the alert banner and the recommendations button for a quiet field", () => {
    renderWithProviders(<FieldParcelCard field={quietField} />);
    expect(screen.getByText("Low Risk")).toBeInTheDocument();
    expect(screen.queryByText("ACTION REQUIRED")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Recommendations" })).not.toBeInTheDocument();
  });

  it("links the field name to its detail page and stretches that link over the whole card", () => {
    renderWithProviders(<FieldParcelCard field={highRiskField} />);
    const link = screen.getByRole("link", { name: "Field B-02" });
    expect(link).toHaveAttribute("href", "/farm/farm-beheira/fields/fld-b02");
    expect(link.className).toContain("after:absolute");
    expect(link.className).toContain("after:inset-0");
  });

  it("keeps the delete button above the stretched link so it never opens the field page", () => {
    renderWithProviders(<FieldParcelCard field={highRiskField} />);
    const trash = screen.getByRole("button", { name: "Delete Field B-02" });
    expect(trash.className).toContain("z-10");
  });
});
