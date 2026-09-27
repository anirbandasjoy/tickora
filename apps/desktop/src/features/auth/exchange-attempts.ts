export const MAX_EXCHANGE_ATTEMPTS = 3;

interface AttemptRecord {
  count: number;
  dead: boolean;
  tick: unknown;
}

export interface AttemptLedger {
  shouldAttempt(key: string, tick: unknown): boolean;
  recordAttempt(key: string, tick: unknown): void;
  recordTerminal(key: string): void;
  attemptsUsed(key: string): number;
}

export function createAttemptLedger(
  maxAttempts: number = MAX_EXCHANGE_ATTEMPTS,
): AttemptLedger {
  const map = new Map<string, AttemptRecord>();
  return {
    shouldAttempt(key, tick) {
      const seen = map.get(key);
      if (!seen) return true;
      if (seen.dead || seen.count >= maxAttempts || seen.tick === tick) return false;
      return true;
    },
    recordAttempt(key, tick) {
      const seen = map.get(key);
      map.set(key, { count: (seen?.count ?? 0) + 1, dead: false, tick });
    },
    recordTerminal(key) {
      const seen = map.get(key);
      map.set(key, { count: seen?.count ?? 0, dead: true, tick: seen?.tick });
    },
    attemptsUsed(key) {
      return map.get(key)?.count ?? 0;
    },
  };
}

export function getErrorStatus(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === 'number') return status;
  }
  return undefined;
}

export function isTerminalStatus(status: number | undefined): boolean {
  return status !== undefined && status !== 429 && status < 500;
}

export function terminalMessage(status: number | undefined): string {
  if (status === 409) return 'This sign-in was already completed. Please try again.';
  return 'The sign-in code was invalid or expired. Please try again.';
}
