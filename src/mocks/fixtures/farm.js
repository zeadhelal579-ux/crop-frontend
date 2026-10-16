/**
 * Mock farm data: the El-Beheira estate, its four active field parcels and
 * the two unmonitored plots that only appear on the satellite grid.
 * One consistent story runs through every screen: Field B-02 (tomatoes) is at
 * 84% of the Tuta absoluta emergence threshold, so it is High risk, shows a
 * red parcel, has a critical recommendation and a trap catch of 48 per week.
 */
import { hoursAgo, minutesAgo, todayAt } from "./dates";
import { PLOT_BOUNDARIES } from "./geometry";

export const FARM = {
  id: "farm-beheira",
  code: "01-BEH",
  name: { en: "El-Beheira Agricultural Estate", ar: "عزبة البحيرة الزراعية" },
  description: {
    en: "Open-field multi-parcel farm using satellite vegetation monitoring and degree-day pest forecasting across the Nile Delta",
    ar: "مزرعة مفتوحة متعددة القطع تستخدم مراقبة الغطاء النباتي بالأقمار الصناعية والتنبؤ بالآفات بالدرجات الحرارية عبر دلتا النيل",
  },
  fieldCount: 4,
  totalAreaHectares: 140,
  overallHealthScore: 94,
  avgSoilMoisture: 28.4,
  ndviCanopy: 0.78,
  activeTraps: 18,
  lastIrrigation: { cycleLabel: "Drip Cycle #12", completedAt: hoursAgo(4), nextScheduledAt: todayAt(18, 0) },
  cropAllocation: [
    { cropType: "tomato", percent: 45, hectares: 63 },
    { cropType: "cucumber", percent: 35, hectares: 49 },
    { cropType: "citrus", percent: 20, hectares: 28 },
  ],
  satellite: { resolutionMPerPx: 10, source: "Sentinel-2", elevationM: 184, lastSyncedAt: minutesAgo(60) },
};

/** Active field parcels (the Farm Overview cards). */
export const FIELDS = [
  {
    id: "fld-b01",
    farmId: FARM.id,
    name: "Field B-01",
    cropType: "tomato",
    areaHectares: 24,
    boundary: PLOT_BOUNDARIES["fld-b01"],
    plantingDate: "2024-09-06",
    isPrimary: false,
    riskClass: "Low",
    cropPhenologyStage: { stage: "FloweringFruitSet", day: 48, progressPct: 52 },
    soilMoisturePct: 31,
    soilMoistureStatus: "Optimal",
    irrigation: { status: "Completed", completedAt: hoursAgo(2), note: "Optimal" },
    trapCatchPerWeek: 2,
    trapStatus: "Dormant",
    ndvi: { value: 0.82, vigorClass: "HighVigor" },
    statusNote: null,
    activeAlert: null,
    subscribedSpeciesIds: ["sp-tuta"],
  },
  {
    id: "fld-b02",
    farmId: FARM.id,
    name: "Field B-02",
    cropType: "tomato",
    areaHectares: 28,
    boundary: PLOT_BOUNDARIES["fld-b02"],
    plantingDate: "2024-08-23",
    isPrimary: true,
    riskClass: "High",
    cropPhenologyStage: { stage: "EarlyRipening", day: 62, progressPct: 68 },
    soilMoisturePct: 24,
    soilMoistureStatus: "Optimal",
    irrigation: { status: "Scheduled", scheduledAt: todayAt(18, 0) },
    trapCatchPerWeek: 48,
    trapStatus: "Critical",
    ndvi: { value: 0.58, vigorClass: "CriticalAlert" },
    statusNote: { en: "Sector Alpha", ar: "القطاع ألفا" },
    activeAlert: { speciesId: "sp-tuta", scientificName: "Tuta absoluta", actionRequired: true },
    subscribedSpeciesIds: ["sp-tuta", "sp-bemisia", "sp-ceratitis"],
  },
  {
    id: "fld-b03",
    farmId: FARM.id,
    name: "Field B-03",
    cropType: "cucumber",
    areaHectares: 32,
    boundary: PLOT_BOUNDARIES["fld-b03"],
    plantingDate: "2024-09-20",
    isPrimary: false,
    riskClass: "Mid",
    cropPhenologyStage: { stage: "VegetativeFruitSet", day: 34, progressPct: 38 },
    soilMoisturePct: 21,
    soilMoistureStatus: "Low",
    irrigation: { status: "UrgentRequired" },
    trapCatchPerWeek: 6,
    trapStatus: "Nominal",
    ndvi: { value: 0.71, vigorClass: "ModerateStress" },
    statusNote: { en: "Mild Moisture Deficit", ar: "نقص رطوبة طفيف" },
    activeAlert: null,
    subscribedSpeciesIds: ["sp-bemisia"],
  },
  {
    id: "fld-b04",
    farmId: FARM.id,
    name: "Field B-04",
    cropType: "citrus",
    areaHectares: 22,
    boundary: PLOT_BOUNDARIES["fld-b04"],
    plantingDate: "2024-06-28",
    isPrimary: false,
    riskClass: "Low",
    cropPhenologyStage: { stage: "MatureCanopy", day: 118, progressPct: 90 },
    soilMoisturePct: 34,
    soilMoistureStatus: "Optimal",
    irrigation: { status: "Completed", completedAt: hoursAgo(8), note: "Saturated" },
    trapCatchPerWeek: 4,
    trapStatus: "Safe",
    ndvi: { value: 0.85, vigorClass: "HighVigor" },
    statusNote: { en: "Canopy Dense", ar: "غطاء كثيف" },
    activeAlert: null,
    subscribedSpeciesIds: ["sp-ceratitis"],
  },
];

/** Plots that are mapped but not actively monitored (no parcel card, label only). */
export const BACKGROUND_PARCELS = [
  { id: "plot-b05", name: "Plot B-05", areaHectares: 18, boundary: PLOT_BOUNDARIES["plot-b05"], statusNote: { en: "Stable", ar: "مستقر" } },
  { id: "plot-b06", name: "Plot B-06", areaHectares: 16, boundary: PLOT_BOUNDARIES["plot-b06"], statusNote: { en: "Dormant Cover", ar: "غطاء خامل" } },
];
