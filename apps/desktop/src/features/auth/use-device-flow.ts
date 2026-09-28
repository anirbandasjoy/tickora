import { useCallback, useEffect, useState } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { hooks } from "../../lib/store";
import {
  detectArchitecture,
  detectPlatform,
  getAppVersion,
  getDeviceName,
  getOrCreateDeviceId,
} from "../../lib/device-info";
import { useCompleteLogin } from "./use-complete-login";
import type { StoredSession } from "../../lib/session-store";

interface DeviceFlowCallbacks {
  onAuthorized: (session: StoredSession) => void;
  onError: (message: string) => void;
}

export function useDeviceFlow({ onAuthorized, onError }: DeviceFlowCallbacks) {
  const [requestAuth] = hooks.useRequestDesktopAuthMutation();
  const [cancelAuthRequest] = hooks.useCancelDesktopAuthMutation();
  const [requestId, setRequestId] = useState<string | null>(null);
  const [authorizeUrl, setAuthorizeUrl] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const markFinished = useCallback(() => setFinished(true), []);
  const { completeLogin: runComplete, exchanging, resetLogin } = useCompleteLogin({
    onAuthorized,
    onError,
    onDone: markFinished,
  });
  const completeLogin = useCallback(
    (code: string, rid: string, tick: unknown = code) => void runComplete(code, rid, tick),
    [runComplete],
  );

  const statusQuery = hooks.useDesktopAuthStatusQuery(
    { requestId: requestId ?? "" },
    { skip: !requestId || finished, pollingInterval: 2000 },
  );

  // Terminal failure: the browser never approved (expired / denied /
  // TTL-evicted). Stop polling and reset so the UI shows the error
  // instead of spinning forever.
  const failTerminal = useCallback(
    (message: string) => {
      setFinished(true);
      setRequestId(null);
      setAuthorizeUrl(null);
      onError(message);
    },
    [onError],
  );

  useEffect(() => {
    if (finished || !requestId) return;
    const s = statusQuery.data?.status;
    if (s === "EXPIRED") failTerminal("The sign-in request expired. Please start again.");
    else if (s === "CANCELLED")
      failTerminal("The sign-in request was denied. Please start again.");
    else if (s === "CONSUMED")
      failTerminal("This sign-in was already completed. Please start again.");
  }, [finished, requestId, statusQuery.data?.status, failTerminal]);

  // 404 = the request document is gone (TTL-evicted after expiry).
  // That's terminal, not a transient connection blip.
  useEffect(() => {
    if (finished || !requestId || !statusQuery.isError) return;
    const err = statusQuery.error as { status?: number } | undefined;
    if (err?.status === 404) failTerminal("The sign-in request expired. Please start again.");
  }, [finished, requestId, statusQuery.isError, statusQuery.error, failTerminal]);

  const startLogin = useCallback(async () => {
    try {
      const deviceIdentifier = getOrCreateDeviceId();
      if (requestId) {
        try {
          await cancelAuthRequest({ requestId, deviceIdentifier }).unwrap();
        } catch {
          // Best effort: expired/consumed requests need no cancel.
        }
      }
      const result = await requestAuth({
        deviceIdentifier,
        deviceName: getDeviceName(),
        platform: detectPlatform(),
        architecture: detectArchitecture(),
        appVersion: await getAppVersion(),
      }).unwrap();
      resetLogin();
      setFinished(false);
      setRequestId(result.requestId);
      setAuthorizeUrl(result.authorizeUrl);
      await openUrl(result.authorizeUrl);
    } catch {
      onError("Could not reach the Tickora server. Is the backend running?");
    }
  }, [requestAuth, cancelAuthRequest, requestId, onError, resetLogin]);

  // Spec §17: polling only surfaces status for UI (remoteStatus).
  // It must NOT auto-exchange into a session — the one-time code
  // via tickora://auth/callback is required. Deep-link listener calls completeLogin.

  const cancelLogin = useCallback(async () => {
    if (requestId) {
      try {
        await cancelAuthRequest({
          requestId,
          deviceIdentifier: getOrCreateDeviceId(),
        }).unwrap();
      } catch {
        // Best effort: expired/consumed requests need no cancel.
      }
    }
    setFinished(true);
    setRequestId(null);
    setAuthorizeUrl(null);
  }, [requestId, cancelAuthRequest]);

  // Idle reset: clear stale flow state without server calls or error
  // messages. Used after successful login and on sign-out so the login
  // screen never shows a stale "Waiting for browser approval…" card.
  const resetFlow = useCallback(() => {
    setFinished(true);
    setRequestId(null);
    setAuthorizeUrl(null);
  }, []);

  const statusErr = statusQuery.error as { status?: number } | undefined;
  return {
    requestId,
    authorizeUrl,
    remoteStatus: finished ? null : (statusQuery.data?.status ?? null),
    // 404 means the request is gone (expired) — surfaced as a terminal
    // error above, not a retryable connection loss.
    pollingError:
      Boolean(requestId) &&
      !finished &&
      statusQuery.isError &&
      statusErr?.status !== 404,
    exchanging,
    startLogin,
    cancelLogin,
    resetFlow,
    completeLogin,
  };
}
