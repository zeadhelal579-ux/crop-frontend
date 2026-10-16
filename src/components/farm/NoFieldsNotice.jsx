/**
 * Empty state shown on the Dashboard and Pests screens when the farm has no
 * field left (for example after the last one was deleted), with a shortcut
 * to Farm Overview where a new field can be added.
 */
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

/** Render the "no fields yet" message. */
export function NoFieldsNotice() {
  const { t } = useTranslation("farm");
  return (
    <div className="glass-card flex flex-col items-center gap-3 p-8 text-center" role="status">
      <h2 className="text-lg font-bold text-neutral-800">{t("noFields.title")}</h2>
      <p className="max-w-md text-sm text-neutral-600">{t("noFields.body")}</p>
      <Link to="/farm" className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-800">
        {t("noFields.cta")}
      </Link>
    </div>
  );
}
