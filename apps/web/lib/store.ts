import type { SessionUser } from "@repo/database";
import { makeStore } from "@repo/store";

const STORAGE_KEY = "tickora:auth";

function loadUser(): SessionUser | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
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
    if (typeof window === "undefined") return;
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable — session keeps working in memory only.
  }
}

export const { store, hooks, apis } = makeStore({
  baseUrl: "/api",
  persist: { loadUser, saveUser },
});

export type { AppDispatch, AppStore, RootState } from "@repo/store";
