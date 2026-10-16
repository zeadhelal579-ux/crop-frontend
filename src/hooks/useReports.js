/**
 * Report generation flow: start a PDF job, poll until it is ready, then
 * download it. The file is fetched through the authenticated axios client
 * (a plain link could not send the in-memory JWT).
 */
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient, getData, postData } from "@/services/apiClient";

const POLL_INTERVAL_MS = 1500;
const REVOKE_DELAY_MS = 10_000;

/** Expose generate(), the live report status and download(). */
export function useReports() {
  const [reportId, setReportId] = useState(null);

  const generation = useMutation({
    mutationFn: (scope) => postData("/api/v1/reports/generate", scope),
    onSuccess: (data) => setReportId(data.reportId),
  });

  const report = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => getData(`/api/v1/reports/${reportId}`),
    enabled: Boolean(reportId),
    refetchInterval: (query) => (query.state.data?.status === "Generating" ? POLL_INTERVAL_MS : false),
  });

  const isGenerating = generation.isPending || report.data?.status === "Generating";

  /** Download the finished PDF and hand it to the browser as a file. */
  async function download() {
    const response = await apiClient.get(`/api/v1/reports/${reportId}/download`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `crop-report-${reportId}.pdf`;
    link.click();
    // Release the temporary URL only after the browser has started the download.
    window.setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
  }

  return { generate: generation.mutate, report: report.data, isGenerating, isError: generation.isError || report.isError, download };
}
