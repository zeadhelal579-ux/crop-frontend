/**
 * Maps an NDVI vigor class to its colours. It mirrors riskColor.js on purpose:
 * green / amber / red carries the same "fine / watch / act" meaning on both
 * the risk badges and the satellite parcel grid.
 */

const VIGOR_STYLES = {
  HighVigor: { hex: "#4CAF50", text: "text-secondary-600", dot: "bg-secondary-500", border: "border-secondary-400" },
  ModerateStress: { hex: "#F4C04E", text: "text-tertiary-700", dot: "bg-tertiary-400", border: "border-tertiary-400" },
  CriticalAlert: { hex: "#B3261E", text: "text-risk-high", dot: "bg-risk-high", border: "border-risk-high" },
};

/** Return the style bundle for a vigor class, falling back to HighVigor. */
export function getVigorStyle(vigorClass) {
  return VIGOR_STYLES[vigorClass] ?? VIGOR_STYLES.HighVigor;
}

/** Return only the hex colour of a vigor class (used by the map overlays). */
export function vigorHex(vigorClass) {
  return getVigorStyle(vigorClass).hex;
}
