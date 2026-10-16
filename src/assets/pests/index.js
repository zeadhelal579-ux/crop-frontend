/**
 * Bundled pest photography keyed by scientific name. These are static
 * assets (not fetched), so species cards never wait on the network for images.
 */
import bemisiaPhoto from "./bemisia-tabaci.jpg";
import ceratitisPhoto from "./ceratitis-capitata.jpg";
import tutaPhoto from "./tuta-absoluta.jpg";

const PEST_PHOTOS = {
  "Tuta absoluta": tutaPhoto,
  "Bemisia tabaci": bemisiaPhoto,
  "Ceratitis capitata": ceratitisPhoto,
};

/** Photo URL for a species, or undefined when none is bundled. */
export function getPestPhoto(scientificName) {
  return PEST_PHOTOS[scientificName];
}
