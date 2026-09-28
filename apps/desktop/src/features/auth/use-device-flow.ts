import { useCallback, useState } from "react";
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

  return {
    requestId,
    authorizeUrl,
    remoteStatus: finished ? null : (statusQuery.data?.status ?? null),
    pollingError: Boolean(requestId) && !finished && statusQuery.isError,
    exchanging,
    startLogin,
    completeLogin,
  };
}
