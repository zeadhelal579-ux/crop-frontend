/**
 * Mock alert history. Messages are { en, ar } pairs resolved by the mock
 * adapter, mirroring the backend that localizes advisories per user language.
 */
import { minutesAgo, hoursAgo } from "./dates";

export const ALERTS = [
  {
    id: "alt-b02-tuta",
    fieldId: "fld-b02",
    fieldName: "Field B-02",
    speciesId: "sp-tuta",
    scientificName: "Tuta absoluta",
    timestamp: minutesAgo(25),
    riskClass: "High",
    messageFarmer: {
      en: "Field B-02: Tuta absoluta outbreak risk is HIGH (84%). Larvae are expected within about 3 days. Apply Bacillus thuringiensis or pheromone mating disruption tomorrow between 05:00 and 07:30.",
      ar: "حقل B-02: خطر تفشي توتا أبسولوتا مرتفع (84%). يُتوقع ظهور اليرقات خلال 3 أيام تقريبًا. طبّق Bacillus thuringiensis أو التشويش على التزاوج غدًا بين 05:00 و07:30.",
    },
    messageGovernment: {
      en: "Advisory: high outbreak probability (84%) of Tuta absoluta recorded in El-Beheira Estate, parcel B-02. Field verification and coordinated biological control are recommended.",
      ar: "إشعار: احتمال تفشي مرتفع (84%) لتوتا أبسولوتا في عزبة البحيرة، القطعة B-02. يُوصى بالتحقق الميداني والمكافحة الحيوية المنسقة.",
    },
    generatedBy: "agent",
    acknowledged: false,
  },
  {
    id: "alt-b03-bemisia",
    fieldId: "fld-b03",
    fieldName: "Field B-03",
    speciesId: "sp-bemisia",
    scientificName: "Bemisia tabaci",
    timestamp: hoursAgo(3),
    riskClass: "Mid",
    messageFarmer: {
      en: "Field B-03: Bemisia tabaci risk is MID (58%). Deploy yellow sticky traps and increase scouting frequency.",
      ar: "حقل B-03: خطر الذبابة البيضاء متوسط (58%). ضع مصائد لاصقة صفراء وكثّف الفحص الحقلي.",
    },
    messageGovernment: {
      en: "Advisory: moderate whitefly pressure (58%) in parcel B-03. Virus-vector monitoring is advised.",
      ar: "إشعار: ضغط متوسط للذبابة البيضاء (58%) في القطعة B-03. يُنصح بمراقبة نقل الفيروسات.",
    },
    generatedBy: "agent",
    acknowledged: false,
  },
  {
    id: "alt-b02-tuta-prev",
    fieldId: "fld-b02",
    fieldName: "Field B-02",
    speciesId: "sp-tuta",
    scientificName: "Tuta absoluta",
    timestamp: hoursAgo(27),
    riskClass: "Mid",
    messageFarmer: {
      en: "Field B-02: Tuta absoluta risk rose to MID (55%). Increase scouting and keep pheromone traps checked daily.",
      ar: "حقل B-02: ارتفع خطر توتا أبسولوتا إلى متوسط (55%). كثّف الفحص وتابع مصائد الفيرمونات يوميًا.",
    },
    messageGovernment: {
      en: "Advisory: rising Tuta absoluta pressure (55%) in parcel B-02. No intervention required yet.",
      ar: "إشعار: ارتفاع ضغط توتا أبسولوتا (55%) في القطعة B-02. لا حاجة لتدخل بعد.",
    },
    generatedBy: "template_fallback",
    acknowledged: true,
  },
];
