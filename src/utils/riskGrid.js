/**
 * Pure helper that turns a cell of the regional risk grid (row/col) into the
 * geographic rectangle it covers, for the Google map and its tests.
 */

/** Rectangle { north, south, east, west } covered by one grid cell inside the bounding box. */
export function cellBounds(cell, bbox, gridShape) {
  const [rows, cols] = gridShape;
  const lonStep = (bbox.maxLon - bbox.minLon) / cols;
  const latStep = (bbox.maxLat - bbox.minLat) / rows;
  return {
    west: bbox.minLon + cell.col * lonStep,
    east: bbox.minLon + (cell.col + 1) * lonStep,
    north: bbox.maxLat - cell.row * latStep,
    south: bbox.maxLat - (cell.row + 1) * latStep,
  };
}
