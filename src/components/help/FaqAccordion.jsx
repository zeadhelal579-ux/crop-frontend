/**
 * Help screen FAQ list. The content is static, localized copy (help.json);
 * no backend endpoint serves it. The first answer carries the three risk-tier
 * cards that document the Low / Mid / High thresholds (ADR-015).
 */
import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { getRiskStyle } from "@/utils/riskColor";

const FAQ_IDS = ["thresholds", "species", "refresh"];
const TIERS = ["Low", "Mid", "High"];

/** Render the FAQ. query filters the questions (client-side search). */
export function FaqAccordion({ query }) {
  const { t } = useTranslation("help");
  const needle = query.trim().toLowerCase();
  const visibleIds = FAQ_IDS.filter((id) => !needle || `${t(`faq.${id}.question`)} ${t(`faq.${id}.answer`)}`.toLowerCase().includes(needle));

  if (visibleIds.length === 0) return <p className="rounded-2xl bg-white/80 p-4 text-sm text-neutral-600">{t("faq.empty")}</p>;

  return (
    <Accordion type="single" collapsible defaultValue={visibleIds.includes("thresholds") ? "thresholds" : undefined} className="space-y-2">
      {visibleIds.map((id) => (
        <AccordionItem key={id} value={id}>
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-800" aria-hidden="true" />
              {t(`faq.${id}.question`)}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>{t(`faq.${id}.answer`)}</p>
            {id === "thresholds" ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {TIERS.map((tier) => (
                  <div key={tier} className={cn("rounded-xl border p-3", getRiskStyle(tier).soft, getRiskStyle(tier).border, "border-opacity-30")}>
                    <p className="text-xs font-bold text-neutral-800">{t(`faq.tiers.${tier}.title`)}</p>
                    <p className="mt-1 text-[11px] text-neutral-600">{t(`faq.tiers.${tier}.action`)}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
