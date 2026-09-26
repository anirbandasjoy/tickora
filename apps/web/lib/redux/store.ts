import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./services/api";
import { authReducer, type AuthState } from "./features/auth/auth-slice";

const STORAGE_KEY = "tickora:auth";

function loadPersistedAuth(): { auth: AuthState } | undefined {
  try {
    if (typeof window === "undefined") return undefined;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const user = JSON.parse(raw) as AuthState["user"];
    if (!user || typeof user !== "object") return undefined;
    return { auth: { user, status: "authed" } };
  } catch {
    return undefined;
  }
}

export function persistAuth(auth: AuthState) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth.user));
  } catch {
    // Storage unavailable — session keeps working in memory only.
  }
}

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    preloadedState: loadPersistedAuth(),
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
