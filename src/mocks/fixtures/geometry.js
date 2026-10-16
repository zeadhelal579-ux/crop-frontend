/**
 * Parcel geometry for the mock farm. Rectangles are laid out on a small grid
 * (1 unit = 0.00042 degree, about 40 m x 47 m) around an El-Beheira (Nile
 * Delta) origin. Each rectangle is sized so its area matches the hectares
 * shown on the parcel cards, so the polygons look right on real satellite
 * imagery. Change ORIGIN_LON / ORIGIN_LAT to move the farm anywhere.
 */

const ORIGIN_LON = 30.4;
const ORIGIN_LAT = 30.8;
const STEP = 0.00042;

/** Build a closed GeoJSON Polygon from west/south/east/north grid units. */
function rectPolygon(west, south, east, north) {
  const lon = (unit) => Number((ORIGIN_LON + unit * STEP).toFixed(5));
  const lat = (unit) => Number((ORIGIN_LAT + unit * STEP).toFixed(5));
  return {
    type: "Polygon",
    coordinates: [
      [
        [lon(west), lat(south)],
        [lon(east), lat(south)],
        [lon(east), lat(north)],
        [lon(west), lat(north)],
        [lon(west), lat(south)],
      ],
    ],
  };
}

export const PLOT_BOUNDARIES = {
  "fld-b01": rectPolygon(8, 15, 21, 25),
  "fld-b02": rectPolygon(24, 20, 38, 31),
  "fld-b03": rectPolygon(4, 2, 21, 12),
  "fld-b04": rectPolygon(41, 18, 54, 27),
  "plot-b05": rectPolygon(38, 4, 49, 13),
  "plot-b06": rectPolygon(17, 33, 27, 41.5),
};
