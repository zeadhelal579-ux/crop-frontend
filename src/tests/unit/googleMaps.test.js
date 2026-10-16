/** Tests for the Google Maps loader URL and the geometry/overlay helpers. */
import { describe, expect, it } from "vitest";
import { buildMapsScriptUrl } from "@/services/googleMaps";
import { createHtmlOverlay, pathCenter, polygonToPath } from "@/utils/googleOverlay";

describe("buildMapsScriptUrl", () => {
  it("asks for the async loader with the key, language and callback", () => {
    const url = new URL(buildMapsScriptUrl("AIzaTestKey", "ar"));
    expect(url.origin + url.pathname).toBe("https://maps.googleapis.com/maps/api/js");
    expect(url.searchParams.get("key")).toBe("AIzaTestKey");
    expect(url.searchParams.get("language")).toBe("ar");
    expect(url.searchParams.get("loading")).toBe("async");
    expect(url.searchParams.get("callback")).toBeTruthy();
  });
});

describe("polygon helpers", () => {
  const polygon = { type: "Polygon", coordinates: [[[30.4, 30.8], [30.5, 30.8], [30.5, 30.9], [30.4, 30.9], [30.4, 30.8]]] };

  it("converts GeoJSON [lon, lat] pairs to { lat, lng } points", () => {
    expect(polygonToPath(polygon)[0]).toEqual({ lat: 30.8, lng: 30.4 });
    expect(polygonToPath(polygon)).toHaveLength(5);
  });

  it("finds the centre of a path's bounding box", () => {
    const centre = pathCenter(polygonToPath(polygon));
    expect(centre.lat).toBeCloseTo(30.85, 5);
    expect(centre.lng).toBeCloseTo(30.45, 5);
  });
});

describe("createHtmlOverlay", () => {
  it("pins the element at the projected pixel and removes it with the overlay", () => {
    class FakeOverlay {
      getPanes() {
        return { floatPane: document.body };
      }
      getProjection() {
        return { fromLatLngToDivPixel: () => ({ x: 120, y: 80 }) };
      }
    }
    const maps = { OverlayView: FakeOverlay, LatLng: function LatLng(lat, lng) { return { lat, lng }; } };
    const element = document.createElement("div");
    const overlay = createHtmlOverlay(maps, { lat: 30.8, lng: 30.4 }, element);
    overlay.onAdd();
    overlay.draw();
    expect(document.body.contains(element)).toBe(true);
    expect(element.style.left).toBe("120px");
    expect(element.style.top).toBe("80px");
    overlay.onRemove();
    expect(document.body.contains(element)).toBe(false);
  });
});
