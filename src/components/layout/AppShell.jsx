/**
 * Persistent frame of every authenticated screen: the field-photo backdrop,
 * the floating TopNav, the active page (Outlet) and the toast area.
 */
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TopNav } from "./TopNav";

/** Render the shell around the active route. */
export function AppShell() {
  return (
    <div className="min-h-screen bg-field">
      <TopNav />
      <main className="pb-12">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
