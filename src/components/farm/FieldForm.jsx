/**
 * Create-field form: name, crop type, area, planting date and the drawn
 * boundary. Validation runs on submit and shows inline, translated messages.
 * On success the field list refreshes (React Query) and onCreated fires.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useCreateField } from "@/hooks/useFields";
import { CROP_TYPES } from "@/lib/constants";
import { pointsToPolygon } from "@/utils/mapProjection";
import { FieldBoundaryDrawer } from "./FieldBoundaryDrawer";

const EMPTY_VALUES = { name: "", cropType: "", areaHectares: "", plantingDate: "" };

/** Validate the form values and return a map of field -> translation key. */
function validate(values, points) {
  const errors = {};
  if (!values.name.trim()) errors.name = "form.errors.name";
  if (!values.cropType) errors.cropType = "form.errors.cropType";
  if (values.areaHectares !== "" && Number(values.areaHectares) <= 0) errors.areaHectares = "form.errors.area";
  if (values.plantingDate && values.plantingDate > new Date().toISOString().slice(0, 10)) errors.plantingDate = "form.errors.plantingDate";
  if (points.length < 3) errors.boundary = "form.errors.boundary";
  return errors;
}

/** Render the form for one farm. */
export function FieldForm({ farmId, onCreated }) {
  const { t } = useTranslation("farm");
  const createField = useCreateField(farmId);
  const [values, setValues] = useState(EMPTY_VALUES);
  const [points, setPoints] = useState([]);
  const [errors, setErrors] = useState({});

  /** Update one text input. */
  function handleChange(event) {
    setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values, points);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    createField.mutate(
      {
        name: values.name.trim(),
        cropType: values.cropType,
        areaHectares: values.areaHectares === "" ? null : Number(values.areaHectares),
        plantingDate: values.plantingDate || null,
        boundaryGeoJson: JSON.stringify(pointsToPolygon(points)),
      },
      {
        onSuccess: (field) => {
          toast({ title: t("form.created", { name: field.name }) });
          onCreated?.(field);
        },
        onError: () => toast({ title: t("form.failed"), variant: "error" }),
      },
    );
  }

  /** Render the inline error line for a field. */
  const renderError = (key) => (errors[key] ? <p className="mt-1 text-[11px] font-semibold text-risk-high">{t(errors[key])}</p> : null);

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div>
        <Label htmlFor="field-name">{t("form.name")}</Label>
        <Input id="field-name" name="name" value={values.name} onChange={handleChange} placeholder={t("form.namePlaceholder")} />
        {renderError("name")}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="field-crop">{t("form.cropType")}</Label>
          <Select value={values.cropType} onValueChange={(cropType) => setValues((previous) => ({ ...previous, cropType }))}>
            <SelectTrigger id="field-crop">
              <SelectValue placeholder={t("form.cropPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {CROP_TYPES.map((crop) => (
                <SelectItem key={crop} value={crop}>
                  {t(`common:cropSingular.${crop}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderError("cropType")}
        </div>
        <div>
          <Label htmlFor="field-area">{t("form.area")}</Label>
          <Input id="field-area" name="areaHectares" type="number" min="0" step="0.1" value={values.areaHectares} onChange={handleChange} />
          {renderError("areaHectares")}
        </div>
      </div>
      <div>
        <Label htmlFor="field-planting">{t("form.plantingDate")}</Label>
        <Input id="field-planting" name="plantingDate" type="date" value={values.plantingDate} onChange={handleChange} />
        {renderError("plantingDate")}
      </div>
      <div>
        <Label>{t("form.boundary")}</Label>
        <FieldBoundaryDrawer points={points} onChange={setPoints} />
        {renderError("boundary")}
      </div>
      <Button type="submit" className="w-full" disabled={createField.isPending}>
        {createField.isPending ? t("form.saving") : t("form.submit")}
      </Button>
    </form>
  );
}
