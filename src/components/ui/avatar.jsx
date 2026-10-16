/**
 * Avatar primitive: a round badge showing the user's profile picture (for
 * example the Google account photo) or, when there is none or it fails to
 * load, their initials.
 */
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Build up-to-two-letter initials from a full name. */
export function getInitials(fullName = "") {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

/** Render the picture of a person, or their initials inside a green circle. */
export function Avatar({ name, imageUrl, className }) {
  const [hasImageFailed, setHasImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !hasImageFailed;

  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-secondary-200 text-xs font-bold text-primary-800",
        className,
      )}
      aria-hidden="true"
    >
      {showImage ? (
        <img src={imageUrl} alt="" referrerPolicy="no-referrer" onError={() => setHasImageFailed(true)} className="h-full w-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}
