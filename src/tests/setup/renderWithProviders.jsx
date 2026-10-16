/**
 * Test helper: renders a component inside the same providers the real app
 * uses (React Query, Router and i18n) so components can be tested in isolation.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@/i18n/i18n";

/** Render ui with fresh providers; options.route sets the initial URL. */
export function renderWithProviders(ui, { route = "/" } = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}
