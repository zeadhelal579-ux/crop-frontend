/**
 * The sign-in block shared by the Login and Register screens. With a Google
 * client id configured it shows the official "Sign in with Google" button;
 * any Google account can use it, and the account is created automatically on
 * first use. Without a client id (a fresh deployment) it explains what is
 * missing and offers the shared demo account so the site is never a dead end.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { GOOGLE_CLIENT_ID, HAS_GOOGLE_CLIENT_ID } from "@/lib/env";
import { releaseGoogleButton, renderGoogleButton } from "@/services/googleIdentity";
import { decodeCredentialPayload, isCredentialAcceptable } from "@/utils/googleCredential";

const MIN_BUTTON_WIDTH = 200;
const MAX_BUTTON_WIDTH = 400;

/** Render the Google button (or the not-configured fallback). mode: "login" | "register". */
export function GoogleAuthPanel({ mode, preferredLanguage }) {
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, signInAsDemo } = useAuth();
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const [status, setStatus] = useState(HAS_GOOGLE_CLIENT_ID ? "loading" : "unconfigured");
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  /** Run a sign-in action, then go to the page the user originally asked for. */
  const runSignIn = useCallback(
    async (signIn) => {
      setError(null);
      setIsSigningIn(true);
      try {
        await signIn();
        navigate(location.state?.from?.pathname ?? "/dashboard", { replace: true });
      } catch {
        setError(t("auth.failed"));
        setIsSigningIn(false);
      }
    },
    [location.state, navigate, t],
  );

  /** Validate the Google credential in the browser, then hand it to the backend. */
  const handleCredential = useCallback(
    (credential) => {
      let isAcceptable = false;
      try {
        isAcceptable = isCredentialAcceptable(decodeCredentialPayload(credential), GOOGLE_CLIENT_ID);
      } catch {
        isAcceptable = false;
      }
      if (!isAcceptable) {
        setError(t("auth.googleFailed"));
        return;
      }
      runSignIn(() => signInWithGoogle({ credential, preferredLanguage }));
    },
    [preferredLanguage, runSignIn, signInWithGoogle, t],
  );

  // Always call the latest handler, so the button does not need re-rendering when it changes.
  const handlerRef = useRef(handleCredential);
  handlerRef.current = handleCredential;

  useEffect(() => {
    if (!HAS_GOOGLE_CLIENT_ID) return undefined;
    let isCancelled = false;
    setStatus("loading");
    const width = Math.min(MAX_BUTTON_WIDTH, Math.max(MIN_BUTTON_WIDTH, Math.floor(wrapperRef.current?.clientWidth ?? MAX_BUTTON_WIDTH)));
    renderGoogleButton(buttonRef.current, {
      clientId: GOOGLE_CLIENT_ID,
      text: mode === "register" ? "signup_with" : "signin_with",
      locale: i18n.language,
      width,
      onCredential: (credential) => handlerRef.current(credential),
    })
      .then(() => !isCancelled && setStatus("ready"))
      .catch(() => !isCancelled && setStatus("blocked"));
    return () => {
      isCancelled = true;
      releaseGoogleButton();
    };
  }, [mode, i18n.language, attempt]);

  if (!HAS_GOOGLE_CLIENT_ID) {
    return (
      <div className="space-y-3">
        <p className="rounded-xl3 bg-risk-midBg p-3 text-xs font-medium text-risk-midText">{t("auth.googleNotConfigured")}</p>
        <Button className="w-full" disabled={isSigningIn} onClick={() => runSignIn(() => signInAsDemo({ preferredLanguage }))}>
          {t("auth.demoContinue")}
        </Button>
        {error ? <p role="alert" className="text-xs font-semibold text-risk-high">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div ref={wrapperRef} className="relative min-h-11">
        {status === "loading" ? <Skeleton className="absolute inset-0 rounded-full" /> : null}
        <div ref={buttonRef} className={isSigningIn ? "pointer-events-none flex justify-center opacity-50" : "flex justify-center"} />
      </div>
      {isSigningIn ? <p className="text-center text-xs text-neutral-600">{t("auth.signingIn")}</p> : null}
      {status === "blocked" ? (
        <div className="space-y-2 text-center">
          <p role="alert" className="text-xs font-semibold text-risk-high">{t("auth.googleBlocked")}</p>
          <Button variant="outlined" size="sm" onClick={() => setAttempt((value) => value + 1)}>
            {t("auth.retry")}
          </Button>
        </div>
      ) : null}
      {error ? <p role="alert" className="text-center text-xs font-semibold text-risk-high">{error}</p> : null}
    </div>
  );
}
