/**
 * Help & Knowledge Center: quick-topic chips, a searchable FAQ, the contact
 * support card and the CROP report download row. FAQ content is static,
 * localized copy; the search is a client-side filter.
 */
import { BookOpen, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaqAccordion } from "@/components/help/FaqAccordion";
import { ContactSupportCard } from "@/components/help/ContactSupportCard";
import { ReportDownloadCard } from "@/components/help/ReportDownloadCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHero } from "@/components/layout/PageHero";
import { Input } from "@/components/ui/input";
import { useFarms } from "@/hooks/useFarms";

const QUICK_TOPICS = [
  { id: "tuta", query: "Tuta absoluta", dot: "bg-risk-high" },
  { id: "gdd", query: "GDD", dot: "bg-tertiary-400" },
  { id: "ndvi", query: "NDVI", dot: "bg-secondary-500" },
];

/** Render the Help screen. */
export default function HelpPage() {
  const { t } = useTranslation("help");
  const farms = useFarms();
  const [query, setQuery] = useState("");

  return (
    <>
      <PageHero title={t("title")} eyebrow={t("eyebrow")} description={t("description")} />

      <PageContainer className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-white/80">
          <span className="uppercase">{t("quickTopics")}</span>
          {QUICK_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setQuery(topic.query)}
              className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-neutral-800 hover:bg-neutral-100"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${topic.dot}`} aria-hidden="true" />
              {t(`topics.${topic.id}`)}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
          <section className="glass-card p-5">
            <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-100 text-primary-700">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-neutral-800">{t("faq.title")}</h2>
                <p className="text-[11px] text-neutral-600">{t("faq.subtitle")}</p>
              </div>
            </div>
            <div className="mt-4">
              <FaqAccordion query={query} />
            </div>
          </section>

          <div className="space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("search")}
                aria-label={t("search")}
                className="rounded-full bg-white/90 ps-9"
              />
            </div>
            <ContactSupportCard />
            <ReportDownloadCard farmId={farms.data?.[0]?.id} />
          </div>
        </div>
      </PageContainer>
    </>
  );
}
