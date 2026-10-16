/**
 * Maps an outbreak risk class (Low / Mid / High, ADR-015) to its display
 * colours. Hex values feed charts and maps; class strings feed badges.
 */

const RISK_STYLES = {
  Low: {
    hex: "#2E9E4F",
    badge: "bg-risk-lowBg text-risk-lowText",
    dot: "bg-risk-low",
    border: "border-risk-low",
    soft: "bg-risk-lowBg",
  },
  Mid: {
    hex: "#E9B949",
    badge: "bg-risk-midBg text-risk-midText",
    dot: "bg-risk-mid",
    border: "border-risk-mid",
    soft: "bg-risk-midBg",
  },
  High: {
    hex: "#B3261E",
    badge: "bg-risk-highBg text-risk-highText",
    dot: "bg-risk-high",
    border: "border-risk-high",
    soft: "bg-risk-highBg",
  },
};

/** Return the style bundle for a risk class, falling back to Low for unknown values. */
export function getRiskStyle(riskClass) {
  return RISK_STYLES[riskClass] ?? RISK_STYLES.Low;
}

/** Return only the hex colour of a risk class (used by Recharts and the Google risk map). */
export function riskHex(riskClass) {
  return getRiskStyle(riskClass).hex;
}
