/**
 * Regional risk-grid fixture used by the mock API (POST /api/v1/risk/grid).
 * It builds a grid of cells with a hot spot near the middle, so the regional
 * heatmap has a realistic shape even before the backend exists. Real species
 * ids are used (never the original "fall_armyworm" placeholder).
 */
import { classifyRisk } from "./fixtures/risk";

const GRID_ROWS = 10;
const GRID_COLS = 14;

/** Build the response body for a risk-grid request. */
export function buildRiskGridResponse(speciesId) {
  const cells = [];
  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      const distance = Math.hypot((row - 4) / GRID_ROWS, (col - 8) / GRID_COLS);
      const probability = Math.max(0.05, Math.min(0.97, 0.95 * Math.exp(-distance * 5) + 0.06 * Math.sin(row + col)));
      cells.push({
        row,
        col,
        accumulatedGdd: Math.round(120 + probability * 330),
        emergenceProbability: Number(probability.toFixed(2)),
        etaDays: Math.max(1, Math.round((1 - probability) * 14)),
        riskClass: classifyRisk(probability),
      });
    }
  }
  return { speciesId, gridShape: [GRID_ROWS, GRID_COLS], cells };
}
