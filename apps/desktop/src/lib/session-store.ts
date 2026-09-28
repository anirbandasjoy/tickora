import { load } from "@tauri-apps/plugin-store";

export interface StoredSession {
  refreshToken: string;
  deviceId: string;
  deviceName: string;
  expiresAt: string;
}

// Spec §9 wants OS secure storage (Credential Manager / Keychain / Secret Service).
// Current: tauri-plugin-store (tickora-auth.json, plaintext) + in-memory access token.
// Follow-up: migrate refreshToken to tauri-plugin-keyring / Stronghold without
// changing this module's API (save/load/clear + getMemoryToken).
// Access token hygiene is preserved: only refreshToken persists; it is sent as
// Bearer and rotated server-side (spec §11).

const STORE_PATH = "tickora-auth.json";
const SESSION_KEY = "session";

let memoryToken: string | null = null;

async function store() {
  return load(STORE_PATH);
}

export function getMemoryToken(): string | null {
  return memoryToken;
}

export async function loadSession(): Promise<StoredSession | null> {
  const s = await store();
  const session = await s.get<StoredSession>(SESSION_KEY);
  if (session?.refreshToken) {
    memoryToken = session.refreshToken;
    return session;
  }
  return null;
}

export async function saveSession(session: StoredSession): Promise<void> {
  memoryToken = session.refreshToken;
  const s = await store();
  await s.set(SESSION_KEY, session);
  await s.save();
}

export async function clearSession(): Promise<void> {
  memoryToken = null;
  const s = await store();
  await s.delete(SESSION_KEY);
  await s.save();
}
