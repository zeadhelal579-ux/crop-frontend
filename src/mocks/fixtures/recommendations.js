/**
 * Mock treatment recommendations (the Guidance screen). Text values carry
 * { en, ar } pairs because the real backend returns them pre-localized for
 * the requester's language (the mock adapter resolves the pair).
 */
import { hoursAgo } from "./dates";

export const RECOMMENDATIONS = [
  {
    id: "rec-bt-b02",
    farmId: "farm-beheira",
    fieldId: "fld-b02",
    fieldName: "Field B-02",
    cropType: "tomato",
    speciesId: "sp-tuta",
    scientificName: "Tuta absoluta",
    priority: "CriticalPriority",
    title: {
      en: "Deploy Bacillus thuringiensis (Bt) & Pheromone Mating Disruption",
      ar: "نشر بكتيريا Bacillus thuringiensis (Bt) مع التشويش على التزاوج بالفيرمونات",
    },
    triggerNote: { en: "Triggered at 84% GDD progress", ar: "تم التفعيل عند 84% من تراكم الدرجات الحرارية" },
    scheduledWindowLabel: { en: "Tomorrow Oct 25, 05:00 - 07:30 AM", ar: "غدًا 25 أكتوبر، 05:00 - 07:30 صباحًا" },
    dosageGuidance: null,
    applicationWindowGuidance: null,
    pollinatorToxicityPct: 0,
    safetyCertifications: [{ en: "Organic Standard", ar: "معيار عضوي" }],
    narrative: {
      en: "expect visible larval tunneling within 4-6 days of threshold crossing",
      ar: "توقع ظهور أنفاق اليرقات خلال 4 إلى 6 أيام من تجاوز العتبة",
    },
    protocolSummary: {
      en: "Schedule targeted Bacillus thuringiensis (Bt) or pheromone mating disruption within 48 hours to suppress female oviposition.",
      ar: "جدولة رش Bacillus thuringiensis (Bt) أو التشويش على التزاوج بالفيرمونات خلال 48 ساعة لمنع وضع الإناث للبيض.",
    },
    description: null,
    status: "Recommended",
    createdAt: hoursAgo(1),
  },
  {
    id: "rec-parasitoid-b03",
    farmId: "farm-beheira",
    fieldId: "fld-b03",
    fieldName: "Field B-03",
    cropType: "cucumber",
    speciesId: "sp-bemisia",
    scientificName: "Bemisia tabaci",
    priority: "PreemptiveBiocontrol",
    title: {
      en: "Targeted Parasitoid Release (Encarsia formosa & Macrolophus pygmaeus)",
      ar: "إطلاق موجّه للطفيليات (Encarsia formosa و Macrolophus pygmaeus)",
    },
    triggerNote: null,
    scheduledWindowLabel: { en: "Release Scheduled: Oct 28", ar: "موعد الإطلاق: 28 أكتوبر" },
    dosageGuidance: { en: "Recommended Ratio: 4 parasitoids per nymph count", ar: "النسبة الموصى بها: 4 طفيليات لكل حورية" },
    applicationWindowGuidance: { en: "Before nymph instar transition", ar: "قبل انتقال الحوريات بين الأطوار" },
    pollinatorToxicityPct: null,
    safetyCertifications: [{ en: "Zero Chemical Residue Safe", ar: "آمن بلا متبقيات كيميائية" }],
    narrative: {
      en: "adult whitefly numbers are expected to peak in about 2 days",
      ar: "يُتوقع أن تبلغ أعداد الذبابة البيضاء البالغة ذروتها خلال يومين تقريبًا",
    },
    protocolSummary: {
      en: "Release Encarsia formosa and Macrolophus pygmaeus before the nymph instar transition to keep the population below the damage threshold.",
      ar: "أطلق Encarsia formosa و Macrolophus pygmaeus قبل انتقال الحوريات بين الأطوار لإبقاء التعداد دون عتبة الضرر.",
    },
    description: null,
    status: "Recommended",
    createdAt: hoursAgo(3),
  },
  {
    id: "rec-diagnostic-b02",
    farmId: "farm-beheira",
    fieldId: "fld-b02",
    fieldName: "Field B-02",
    cropType: "tomato",
    speciesId: "sp-tuta",
    scientificName: "Tuta absoluta",
    priority: "DiagnosticTrigger",
    title: {
      en: "Thermal Cycle Anomaly (+1.8°C above 10-year mean) Compression",
      ar: "شذوذ في الدورة الحرارية (أعلى بـ 1.8°م من متوسط 10 سنوات) يضغط دورة التطور",
    },
    triggerNote: null,
    scheduledWindowLabel: null,
    dosageGuidance: null,
    applicationWindowGuidance: null,
    pollinatorToxicityPct: null,
    safetyCertifications: [],
    narrative: null,
    protocolSummary: null,
    description: {
      en: "Accumulative Growing Degree Days (GDD) reached 380 degree-days 6 days earlier than the seasonal baseline, accelerating Tuta larval development cycle from standard 24 days to 16.5 days.",
      ar: "وصل تراكم الدرجات الحرارية إلى 380 درجة-يوم قبل خط الأساس الموسمي بـ 6 أيام، ما سرّع دورة تطور يرقات توتا من 24 يومًا إلى 16.5 يومًا.",
    },
    status: "Recommended",
    createdAt: hoursAgo(5),
  },
];
