/**
 * Floating top navigation pill shown on every authenticated screen: logo,
 * the five main tabs, language switch, alert bell (with the real count of
 * unacknowledged alerts) and the user menu. The active tab is derived from
 * the current route, never from local state.
 */
import { Bell, LogOut, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logoUrl from "@/assets/brand/logo.png";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAlerts } from "@/hooks/useAlerts";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

const NAV_ITEMS = [
  { to: "/dashboard", labelKey: "nav.dashboard" },
  { to: "/farm", labelKey: "nav.farm" },
  { to: "/pests", labelKey: "nav.pests" },
  { to: "/guidance", labelKey: "nav.guidance" },
  { to: "/help", labelKey: "nav.help" },
];

/** Render the navigation bar. */
export function TopNav() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const alerts = useAlerts();
  const unacknowledgedCount = alerts.data?.filter((alert) => !alert.acknowledged).length ?? 0;

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-3xl bg-neutral-800/90 px-4 py-2 text-white shadow-pill backdrop-blur sm:gap-x-4 md:flex-nowrap md:rounded-full">
        <Link to="/dashboard" className="shrink-0" aria-label="CROP">
          <img src={logoUrl} alt="CROP" className="h-8 w-auto brightness-0 invert" />
        </Link>

        <nav className="order-last flex w-full min-w-0 justify-start gap-1 overflow-x-auto md:order-none md:w-auto md:flex-1 md:justify-center" aria-label={t("nav.label")}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive ? "bg-white text-neutral-800" : "text-white/80 hover:bg-white/10",
                )
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <Link
            to="/alerts"
            className="relative rounded-full p-2 text-white hover:bg-white/10"
            aria-label={t("nav.alerts", { number: unacknowledgedCount })}
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            {unacknowledgedCount > 0 ? (
              <span className="absolute end-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-risk-high px-1 text-[10px] font-bold">
                {unacknowledgedCount}
              </span>
            ) : null}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="flex items-center gap-2 rounded-full p-1 hover:bg-white/10" aria-label={t("nav.userMenu")}>
                <Avatar name={user?.fullName} imageUrl={user?.pictureUrl} />
                <span className="hidden text-start leading-tight md:block">
                  <span className="block text-xs font-semibold">{user?.fullName?.split(" ")[0]}</span>
                  <span className="block text-[10px] text-white/60">{user ? t(`roles.${user.role}`) : ""}</span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => navigate("/settings")}>
                <Settings className="h-4 w-4" aria-hidden="true" />
                {t("nav.settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {t("nav.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
