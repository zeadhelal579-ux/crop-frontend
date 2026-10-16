/** Tests for AgentAlertFeed: farmer wording, acknowledge button and empty state. */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@/i18n/i18n";
import { AgentAlertFeed } from "@/components/alerts/AgentAlertFeed";

const alert = {
  id: "a1",
  fieldName: "Field B-02",
  scientificName: "Tuta absoluta",
  timestamp: new Date().toISOString(),
  riskClass: "High",
  messageFarmer: "Farmer wording",
  messageGovernment: "Government wording",
  generatedBy: "agent",
  acknowledged: false,
};

describe("AgentAlertFeed", () => {
  it("shows the farmer wording of the alert", () => {
    render(<AgentAlertFeed alerts={[alert]} emptyText="none" />);
    expect(screen.getByText("Farmer wording")).toBeInTheDocument();
    expect(screen.queryByText("Government wording")).not.toBeInTheDocument();
  });

  it("calls onAcknowledge with the alert id", () => {
    const onAcknowledge = vi.fn();
    render(<AgentAlertFeed alerts={[alert]} onAcknowledge={onAcknowledge} emptyText="none" />);
    fireEvent.click(screen.getByRole("button", { name: "Acknowledge" }));
    expect(onAcknowledge).toHaveBeenCalledWith("a1");
  });

  it("shows the empty text when there are no alerts", () => {
    render(<AgentAlertFeed alerts={[]} emptyText="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
