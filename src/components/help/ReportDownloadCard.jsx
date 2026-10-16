/**
 * "CROP Report" download row (used on Help and inside the Dashboard dialog).
 * Press Download -> a PDF job starts -> the card polls until it is ready and
 * then saves the file. A second job cannot start while one is generating.
 */
import { FileText, LoaderCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useReports } from "@/hooks/useReports";
import { formatNumber } from "@/utils/formatDate";

const BYTES_PER_MEGABYTE = 1024 * 1024;
const DEFAULT_RANGE_DAYS = 30;

/** Default report period: the last 30 days up to today (ISO dates). */
function defaultDateRange() {
  const end = new Date();
  const start = new Date(end.getTime() - DEFAULT_RANGE_DAYS * 24 * 60 * 60 * 1000);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

/** Render the report row. farmId scopes the report to one farm. */
export function ReportDownloadCard({ farmId }) {
  const { t, i18n } = useTranslation("help");
  const { generate, report, isGenerating, isError, download } = useReports();
  const hasDownloaded = useRef(false);

  // When the report becomes ready, save it exactly once.
  useEffect(() => {
    if (report?.status === "Ready" && !hasDownloaded.current) {
      hasDownloaded.current = true;
      download().catch(() => toast({ title: t("report.failed"), variant: "error" }));
    }
  }, [report?.status, download, t]);

  function handleClick() {
    hasDownloaded.current = false;
    generate({ farmId, dateRange: defaultDateRange() });
  }

  const sizeLabel =
    report?.status === "Ready"
      ? t("report.meta", { version: report.versionLabel, size: formatNumber(Math.round(report.sizeBytes / BYTES_PER_MEGABYTE), i18n.language) })
      : t("report.defaultMeta");

  return (
    <div className="glass-card flex items-center justify-between gap-3 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-white">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold text-neutral-800">{t("report.title")}</p>
          <p className="text-[11px] text-neutral-500">{isError ? t("report.failed") : sizeLabel}</p>
        </div>
      </div>
      <Button size="sm" variant="secondary" className="bg-white" disabled={isGenerating} onClick={handleClick}>
        {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {isGenerating ? t("report.generating") : t("report.download")}
      </Button>
    </div>
  );
}
