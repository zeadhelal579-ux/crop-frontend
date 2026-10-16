/**
 * "Target Pest" card: species dropdown, pest photo and a "Species (Crop)"
 * caption. Choosing a species updates the shared uiStore selection, so the
 * GDD card and the risk monitor re-scope without prop drilling. The expand
 * arrow opens the Pests screen already focused on the chosen species.
 */
import { Maximize2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getPestPhoto } from "@/assets/pests";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useUiStore } from "@/stores/uiStore";

/** Render the species picker card. */
export function TargetPestCard({ speciesList, species, cropType }) {
  const { t } = useTranslation("dashboard");
  const setSelectedSpeciesId = useUiStore((state) => state.setSelectedSpeciesId);

  if (!species || !cropType) return <Skeleton className="h-80 rounded-xl3" />;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle className="text-xl">{t("targetPest.title")}</CardTitle>
        <Select value={species.id} onValueChange={setSelectedSpeciesId}>
          <SelectTrigger className="h-8 w-40 rounded-full text-xs" aria-label={t("targetPest.select")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {speciesList.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.scientificName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <div className="relative mx-5 mb-5 flex-1 overflow-hidden rounded-2xl">
        <img src={getPestPhoto(species.scientificName)} alt={species.commonName} className="h-52 w-full object-cover" />
        <span className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold text-neutral-800 shadow-pill">
          {t("targetPest.caption", { species: species.scientificName, crop: t(`common:cropSingular.${cropType}`) })}
        </span>
        <Link
          to={`/pests?species=${species.id}`}
          className="absolute bottom-2 end-2 rounded-full bg-white/80 p-1.5 text-neutral-700 hover:bg-white"
          aria-label={t("targetPest.open")}
        >
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
