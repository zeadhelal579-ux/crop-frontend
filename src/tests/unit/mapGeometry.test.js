/** Tests for the pure map helpers: SVG projection, boundary points and the risk grid. */
import { describe, expect, it } from "vitest";
import { boundsAround, canvasToLonLat, lonLatToCanvas, pointsToPolygon, projectPolygons } from "@/utils/mapProjection";
import { cellBounds } from "@/utils/riskGrid";

const square = (west, south, east, north) => ({
  type: "Polygon",
  coordinates: [[[west, south], [east, south], [east, north], [west, north], [west, south]]],
});

describe("projectPolygons", () => {
  it("keeps every projected point inside the canvas", () => {
    const projected = projectPolygons([square(30.4, 30.8, 30.41, 30.81), square(30.42, 30.82, 30.43, 30.83)], 1000, 520);
    for (const item of projected) {
      for (const pair of item.points.split(" ")) {
        const [x, y] = pair.split(",").map(Number);
        expect(x).toBeGreaterThan(0);
        expect(x).toBeLessThan(1000);
        expect(y).toBeGreaterThan(0);
        expect(y).toBeLessThan(520);
      }
    }
  });

  it("places a polygon that is north of another higher on the canvas", () => {
    const [south, north] = projectPolygons([square(30.4, 30.8, 30.41, 30.81), square(30.4, 30.82, 30.41, 30.83)], 1000, 520);
    expect(north.center.y).toBeLessThan(south.center.y);
  });
});

describe("canvas <-> coordinates", () => {
  const bounds = boundsAround({ longitude: 30.4, latitude: 30.8 }, 0.01, 0.01);

  it("round-trips a point", () => {
    const point = canvasToLonLat(0.25, 0.75, bounds);
    const back = lonLatToCanvas(point, bounds);
    expect(back.x).toBeCloseTo(0.25, 2);
    expect(back.y).toBeCloseTo(0.75, 2);
  });

  it("closes a polygon from 3+ points and rejects fewer", () => {
    expect(pointsToPolygon([[0, 0], [1, 0]])).toBeNull();
    const polygon = pointsToPolygon([[0, 0], [1, 0], [1, 1]]);
    expect(polygon.coordinates[0]).toHaveLength(4);
    expect(polygon.coordinates[0][0]).toEqual(polygon.coordinates[0][3]);
  });
});

describe("risk grid helpers", () => {
  const bbox = { minLat: 30, minLon: 30, maxLat: 31, maxLon: 31 };

  it("puts the first cell in the north-west corner of the box", () => {
    const bounds = cellBounds({ row: 0, col: 0 }, bbox, [10, 10]);
    expect(bounds.west).toBeCloseTo(30, 5);
    expect(bounds.north).toBeCloseTo(31, 5);
    expect(bounds.east).toBeCloseTo(30.1, 5);
    expect(bounds.south).toBeCloseTo(30.9, 5);
  });

  it("tiles the box without gaps: the last cell ends at the south-east corner", () => {
    const bounds = cellBounds({ row: 9, col: 9 }, bbox, [10, 10]);
    expect(bounds.east).toBeCloseTo(31, 5);
    expect(bounds.south).toBeCloseTo(30, 5);
  });
});
