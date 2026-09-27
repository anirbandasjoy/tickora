import { useCallback, useState } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { hooks } from "../../lib/store";
import { detectPlatform, getAppVersion, getOrCreateDeviceId } from "../../lib/device-info";
import { saveSession, type StoredSession } from "../../lib/session-store";

interface DeviceFlowCallbacks {
  onAuthorized: (session: StoredSession) => void;
  onError: (message: string) => void;
}

export function useDeviceFlow({ onAuthorized, onError }: DeviceFlowCallbacks) {
  const [requestAuth] = hooks.useRequestDesktopAuthMutation();
  const [exchangeCode] = hooks.useExchangeCodeMutation();
  const [requestId, setRequestId] = useState<string | null>(null);
  const [authorizeUrl, setAuthorizeUrl] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [exchanging, setExchanging] = useState(false);

  const statusQuery = hooks.useDesktopAuthStatusQuery(
    { requestId: requestId ?? "" },
    { skip: !requestId || finished, pollingInterval: 2000 },
  );

  const completeLogin = useCallback(
    async (code: string, rid: string) => {
      setExchanging(true);
      try {
        const result = await exchangeCode({ requestId: rid, code }).unwrap();
        const session: StoredSession = {
          refreshToken: result.refreshToken,
          deviceId: result.device.id,
          deviceName: result.device.name,
          expiresAt: result.expiresAt,
        };
        await saveSession(session);
        setFinished(true);
        onAuthorized(session);
      } catch {
        onError("The sign-in code was invalid or expired. Please try again.");
      } finally {
        setExchanging(false);
      }
    },
    [exchangeCode, onAuthorized, onError],
  );

  const startLogin = useCallback(async () => {
    try {
      const result = await requestAuth({
        deviceIdentifier: getOrCreateDeviceId(),
        platform: detectPlatform(),
        appVersion: await getAppVersion(),
      }).unwrap();
      setFinished(false);
      setRequestId(result.requestId);
      setAuthorizeUrl(result.authorizeUrl);
      await openUrl(result.authorizeUrl);
    } catch {
      onError("Could not reach the Tickora server. Is the backend running?");
    }
  }, [requestAuth, onError]);

  return {
    requestId,
    authorizeUrl,
    remoteStatus: finished ? null : (statusQuery.data?.status ?? null),
    exchanging,
    startLogin,
    completeLogin,
  };
}
