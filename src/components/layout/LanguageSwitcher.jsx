/**
 * EN / AR toggle shown in the top navigation of every screen. The UI flips
 * language and direction instantly; saving the preference on the backend (so
 * AI-written alerts and reports follow it) happens in the background.
 */
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { patchData } from "@/services/apiClient";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

/** Toggle between English and Arabic. */
export function LanguageSwitcher({ className }) {
  const { t, i18n } = useTranslation("common");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const nextLanguage = i18n.language === "ar" ? "en" : "ar";

  async function handleToggle() {
    await i18n.changeLanguage(nextLanguage);
    if (isAuthenticated) {
      patchData("/api/v1/users/me", { preferredLanguage: nextLanguage }).catch(() => {
        // Saving the preference is best effort; the visible switch already happened.
      });
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={t("language.switchTo", { language: t(`language.names.${nextLanguage}`) })}
      className={cn("inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20", className)}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      {i18n.language.toUpperCase()}
    </button>
  );
}
