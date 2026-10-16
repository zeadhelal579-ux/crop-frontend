/**
 * Species picker for the field detail page: one card per monitored pest. It is
 * the only species control on that page - the selected card decides which
 * species the GDD, risk and trap charts below show.
 */
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

/** Render the species cards; the one matching selectedId is highlighted. */
export function SpeciesSelector({ speciesList, selectedId, onSelect }) {
  const { t } = useTranslation("farm");

  return (
    <div role="tablist" aria-label={t("detail.speciesTabs")} className="grid gap-3 sm:grid-cols-3">
      {speciesList.map((species) => {
        const isSelected = species.id === selectedId;
        return (
          <button
            key={species.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(species.id)}
            className={cn(
              "flex w-full items-start justify-between gap-2 rounded-2xl border p-3 text-start transition-colors",
              isSelected ? "border-secondary-500 bg-secondary-50 ring-2 ring-secondary-400" : "border-neutral-200 bg-white hover:bg-neutral-50",
            )}
          >
            <span>
              <span className="block text-sm font-bold text-neutral-800">{species.commonName}</span>
              <span className="block text-[11px] italic text-neutral-600">{species.scientificName}</span>
              <span className="mt-1 block text-[10px] text-neutral-500">{t(`species.method.${species.monitoringMethod}`)}</span>
            </span>
            {isSelected ? <Check className="h-4 w-4 text-secondary-600" aria-hidden="true" /> : null}
          </button>
        );
      })}
    </div>
  );
}
