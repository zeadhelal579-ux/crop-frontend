/**
 * Thin wrapper around Google Identity Services (the "Sign in with Google"
 * button). The Google script is loaded on demand - only when a screen that
 * shows the button mounts - and initialised once per client id. The button's
 * credential callback is routed to whichever component rendered it last.
 */
const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";

let scriptPromise = null;
let initialisedClientId = null;
let credentialHandler = null;

/** Load the Google script once and resolve with google.accounts.id. */
export function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = GIS_SCRIPT_URL;
      script.async = true;
      script.onload = () => (window.google?.accounts?.id ? resolve(window.google.accounts.id) : reject(new Error("Google Identity Services unavailable")));
      script.onerror = () => {
        scriptPromise = null;
        script.remove();
        reject(new Error("Google Identity Services failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

/** Draw the official Google button inside container; onCredential receives the ID token string. */
export async function renderGoogleButton(container, { clientId, text, locale, width, onCredential }) {
  const googleId = await loadGoogleIdentity();
  credentialHandler = onCredential;
  if (initialisedClientId !== clientId) {
    googleId.initialize({
      client_id: clientId,
      callback: (response) => credentialHandler?.(response.credential),
    });
    initialisedClientId = clientId;
  }
  container.replaceChildren();
  googleId.renderButton(container, { type: "standard", theme: "outline", size: "large", shape: "pill", logo_alignment: "left", text, locale, width });
}

/** Stop delivering credentials to a component that is going away. */
export function releaseGoogleButton() {
  credentialHandler = null;
}
