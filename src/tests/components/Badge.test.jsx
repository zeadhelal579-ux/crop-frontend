/** Tests for the Badge primitive and the risk colours it receives. */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/badge";
import { getRiskStyle } from "@/utils/riskColor";

describe("Badge", () => {
  it("renders text with caller-provided risk colours", () => {
    render(<Badge className={getRiskStyle("High").badge}>High Risk</Badge>);
    expect(screen.getByText("High Risk")).toHaveClass("bg-risk-highBg");
  });
});
