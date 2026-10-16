/**
 * Tests for GoogleAuthPanel in a deployment with no Google client id: it must
 * say so and offer the demo account, which signs in and sends the user on.
 */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { GoogleAuthPanel } from "@/components/auth/GoogleAuthPanel";
import { renderWithProviders } from "../setup/renderWithProviders";

const { signInAsDemo } = vi.hoisted(() => ({ signInAsDemo: vi.fn() }));

vi.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ signInWithGoogle: vi.fn(), signInAsDemo }) }));
// Force "no client id" even when a developer has put a real one in .env.
vi.mock("@/lib/env", () => ({ GOOGLE_CLIENT_ID: "", HAS_GOOGLE_CLIENT_ID: false }));

/** Render the panel with a /dashboard route to land on. */
function renderPanel() {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<GoogleAuthPanel mode="login" preferredLanguage="en" />} />
      <Route path="/dashboard" element={<p>Dashboard reached</p>} />
    </Routes>,
  );
}

describe("GoogleAuthPanel without a Google client id", () => {
  it("explains that Google sign-in is not set up and offers the demo account", () => {
    renderPanel();
    expect(screen.getByText(/not set up on this deployment/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /demo account/i })).toBeInTheDocument();
  });

  it("signs in as the demo account and navigates to the dashboard", async () => {
    signInAsDemo.mockResolvedValue(undefined);
    renderPanel();
    fireEvent.click(screen.getByRole("button", { name: /demo account/i }));
    expect(await screen.findByText("Dashboard reached")).toBeInTheDocument();
    expect(signInAsDemo).toHaveBeenCalledWith({ preferredLanguage: "en" });
  });

  it("shows an error and stays on the page when sign-in fails", async () => {
    signInAsDemo.mockRejectedValue(new Error("down"));
    renderPanel();
    fireEvent.click(screen.getByRole("button", { name: /demo account/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/something went wrong/i));
    expect(screen.queryByText("Dashboard reached")).toBeNull();
  });
});
