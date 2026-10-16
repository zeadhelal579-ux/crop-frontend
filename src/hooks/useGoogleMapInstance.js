/**
 * Creates one google.maps.Map inside a container div and cleans it up on
 * unmount. The options are read once, when the map is created.
 */
import { useEffect, useRef, useState } from "react";

const BASE_OPTIONS = {
  mapTypeId: "satellite",
  disableDefaultUI: true,
  clickableIcons: false,
  keyboardShortcuts: false,
  gestureHandling: "cooperative",
  tilt: 0,
};

/** Returns { containerRef, map }; map is null until the first render has mounted. */
export function useGoogleMapInstance(maps, options) {
  const containerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    const instance = new maps.Map(container, { ...BASE_OPTIONS, ...options });
    setMap(instance);
    return () => {
      maps.event.clearInstanceListeners(instance);
      container.replaceChildren();
      setMap(null);
    };
    // options is intentionally read only at creation time.
  }, [maps]);

  return { containerRef, map };
}
