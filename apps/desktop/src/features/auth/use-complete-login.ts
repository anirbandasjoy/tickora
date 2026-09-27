import { useCallback, useRef, useState } from "react";
import { hooks } from "../../lib/store";
import { saveSession, type StoredSession } from "../../lib/session-store";
import {
  MAX_EXCHANGE_ATTEMPTS,
  createAttemptLedger,
  getErrorStatus,
  isTerminalStatus,
  terminalMessage,
} from "./exchange-attempts";

interface CompleteLoginCallbacks {
  onAuthorized: (session: StoredSession) => void;
  onError: (message: string) => void;
  onDone: () => void;
}

export function useCompleteLogin({ onAuthorized, onError, onDone }: CompleteLoginCallbacks) {
  const [exchangeCode] = hooks.useExchangeCodeMutation();
  const [exchanging, setExchanging] = useState(false);
  const ledger = useRef(createAttemptLedger());
  const doneRef = useRef(false);
  const exchangingFor = useRef<string | null>(null);

  const resetLogin = useCallback(() => {
    doneRef.current = false;
    exchangingFor.current = null;
  }, []);

  const completeLogin = useCallback(
    async (code: string | null, rid: string, tick: unknown = code) => {
      const key = `${rid}:${code ?? "poll"}`;
      if (exchangingFor.current === rid) return;
      if (!ledger.current.shouldAttempt(key, tick)) return;
      ledger.current.recordAttempt(key, tick);
      exchangingFor.current = rid;
      setExchanging(true);
      try {
        const result = await exchangeCode(
          code === null ? { requestId: rid } : { requestId: rid, code },
        ).unwrap();
        const session: StoredSession = {
          refreshToken: result.refreshToken,
          deviceId: result.device.id,
          deviceName: result.device.name,
          expiresAt: result.expiresAt,
        };
        await saveSession(session);
        doneRef.current = true;
        onDone();
        onAuthorized(session);
      } catch (e) {
        if (doneRef.current) return;
        const status = getErrorStatus(e);
        if (isTerminalStatus(status)) {
          ledger.current.recordTerminal(key);
          onError(terminalMessage(status));
        } else if (ledger.current.attemptsUsed(key) >= MAX_EXCHANGE_ATTEMPTS) {
          onError("Sign-in failed. Please try again.");
        }
      } finally {
        exchangingFor.current = null;
        setExchanging(false);
      }
    },
    [exchangeCode, onAuthorized, onError, onDone],
  );

  return { completeLogin, exchanging, resetLogin };
}
