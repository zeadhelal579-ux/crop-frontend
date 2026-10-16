/**
 * Farm Overview screen: the farm hero card, the satellite grid and the
 * "Active Field Parcels" cards. A farm switcher appears only when the
 * organization owns more than one farm.
 */
import { Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FarmHealthHero } from "@/components/farm/FarmHealthHero";
import { FieldForm } from "@/components/farm/FieldForm";
import { FieldParcelCard } from "@/components/farm/FieldParcelCard";
import { SatelliteGridMap } from "@/components/farm/SatelliteGridMap";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useFarm, useFarms } from "@/hooks/useFarms";
import { useAuth } from "@/hooks/useAuth";
import { useFarmFields } from "@/hooks/useFields";
import { useSatelliteGrid } from "@/hooks/useSatelliteGrid";
import { FIELD_MANAGER_ROLES } from "@/lib/constants";
import { getRelativeAge } from "@/utils/formatDate";

/** Render the Farm Overview screen. */
export default function FarmOverviewPage() {
  const { t } = useTranslation("farm");
  const { user } = useAuth();
  const farms = useFarms();
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const farmId = selectedFarmId ?? farms.data?.[0]?.id;
  const farm = useFarm(farmId);
  const fields = useFarmFields(farmId);
  const satellite = useSatelliteGrid(farmId);
  const syncAge = satellite.data ? getRelativeAge(satellite.data.lastSyncedAt) : null;
  const canCreateField = FIELD_MANAGER_ROLES.includes(user?.role);

  return (
    <>
      <PageHero title={t("title")}>
        {farms.data?.length > 1 ? (
          <Select value={farmId} onValueChange={setSelectedFarmId}>
            <SelectTrigger className="h-9 w-56 rounded-full bg-white text-xs" aria-label={t("switchFarm")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {farms.data.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </PageHero>

      <PageContainer>{farm.data ? <FarmHealthHero farm={farm.data} /> : <Skeleton className="h-80 rounded-xl3" />}</PageContainer>

      <section className="-mb-12 mt-8 bg-surface pb-16 pt-8">
        <PageContainer className="space-y-8">
          <SatelliteGridMap farmId={farmId} />

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-neutral-800">{t("parcels.title")}</h2>
              <div className="flex items-center gap-2">
                {syncAge ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-3 py-1.5 text-[11px] font-semibold text-white">
                    <RefreshCw className="h-3 w-3" aria-hidden="true" />
                    {t("parcels.synced", { age: t(`common:time.${syncAge.unit}Ago`, { value: syncAge.value }) })}
                  </span>
                ) : null}
                {canCreateField && farmId ? (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        {t("parcels.newField")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="text-lg font-bold">{t("form.title")}</DialogTitle>
                      <DialogDescription className="mb-4 text-sm text-neutral-600">{t("form.description")}</DialogDescription>
                      <FieldForm farmId={farmId} onCreated={() => setIsDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                ) : null}
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {fields.data
                ? fields.data.map((field) => <FieldParcelCard key={field.id} field={field} />)
                : [0, 1, 2, 3].map((key) => <Skeleton key={key} className="h-96 rounded-xl3" />)}
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
