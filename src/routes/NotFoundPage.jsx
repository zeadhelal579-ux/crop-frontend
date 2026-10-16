/**
 * Catch-all 404 screen with a link back to the dashboard.
 */
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

/** Render the "page not found" message. */
export default function NotFoundPage() {
  const { t } = useTranslation("common");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-field p-6 text-center text-white">
      <p className="text-6xl font-bold">404</p>
      <p className="text-lg">{t("notFound.message")}</p>
      <Link to="/dashboard" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100">
        {t("notFound.back")}
      </Link>
    </div>
  );
}
