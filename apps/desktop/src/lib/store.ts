import type { SessionUser } from "@repo/database";
import { makeStore } from "@repo/store";
import { getMemoryToken } from "./session-store";

const STORAGE_KEY = "tickora:auth";

function loadUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as SessionUser;
    if (!user || typeof user !== "object") return null;
    return user;
  } catch {
    return null;
  }
}

function saveUser(user: SessionUser | null) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable — session keeps working in memory only.
  }
}

function getToken(): string | null {
  return getMemoryToken();
}

export const { store, hooks, apis } = makeStore({
  baseUrl: import.meta.env.VITE_API_URL as string,
  getToken,
  persist: { loadUser, saveUser },
});

export type { AppDispatch, AppStore, RootState } from "@repo/store";
