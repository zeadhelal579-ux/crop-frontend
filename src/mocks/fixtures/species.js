/**
 * Mock species catalogue (the three pests of record). Threshold numbers
 * follow the approved design screens; real values come from the versioned
 * species calibration on the backend. trapThreshold is the intervention line
 * drawn on the Pests deep-dive chart.
 */

export const SPECIES = [
  {
    id: "sp-tuta",
    scientificName: "Tuta absoluta",
    commonName: { en: "Tomato Leafminer", ar: "حفارة أوراق الطماطم" },
    order: "Lepidoptera",
    family: "Gelechiidae",
    tbaseC: 8,
    upperTempC: 34,
    gddThermalConstant: 450,
    lifeStageThresholds: [
      { stage: "Egg", min: 70, max: 90 },
      { stage: "Larva", min: 280, max: 300 },
      { stage: "Pupa", min: 410, max: 420 },
    ],
    monitoringMethod: "pheromone",
    isQuarantinePest: false,
    trapThreshold: 42,
    hostCrops: ["tomato", "citrus"],
  },
  {
    id: "sp-bemisia",
    scientificName: "Bemisia tabaci",
    commonName: { en: "Silverleaf Whitefly", ar: "الذبابة البيضاء" },
    order: "Hemiptera",
    family: "Aleyrodidae",
    tbaseC: 11,
    upperTempC: 33,
    gddThermalConstant: 175,
    lifeStageThresholds: [
      { stage: "Egg", min: 40, max: 60 },
      { stage: "Nymph", min: 100, max: 130 },
      { stage: "Adult", min: 150, max: 175 },
    ],
    monitoringMethod: "yellowSticky",
    isQuarantinePest: false,
    trapThreshold: 30,
    hostCrops: ["cucumber", "tomato"],
  },
  {
    id: "sp-ceratitis",
    scientificName: "Ceratitis capitata",
    commonName: { en: "Medfly", ar: "ذبابة فاكهة المتوسط" },
    order: "Diptera",
    family: "Tephritidae",
    tbaseC: 10,
    upperTempC: 35,
    gddThermalConstant: 300,
    lifeStageThresholds: [
      { stage: "Egg", min: 30, max: 40 },
      { stage: "Larva", min: 140, max: 180 },
      { stage: "Pupa", min: 260, max: 300 },
    ],
    monitoringMethod: "mcphail",
    isQuarantinePest: true,
    trapThreshold: 8,
    hostCrops: ["citrus"],
  },
];
