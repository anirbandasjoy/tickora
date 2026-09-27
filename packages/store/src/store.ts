import type { SessionUser } from "@repo/database";
import { createBaseApi, type BaseApiConfig } from "./base-api";
import { sessionReducer } from "./features/auth/session-slice";
import { wireApis } from "./wire-apis";
import { collectHooks } from "./collect-hooks";
import { configureStore } from "@reduxjs/toolkit";

export interface PersistStorage {
  loadUser: () => SessionUser | null;
  saveUser: (user: SessionUser | null) => void;
}

export interface StoreConfig extends BaseApiConfig {
  persist?: PersistStorage;
}

export function makeStore(config: StoreConfig) {
  const { persist, ...apiConfig } = config;
  const baseApi = createBaseApi(apiConfig);
  const apis = wireApis(baseApi);
  const hooks = collectHooks(apis);

  const persistedUser = persist?.loadUser() ?? null;

  const store = configureStore({
    reducer: {
      session: sessionReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    preloadedState: persistedUser
      ? { session: { user: persistedUser, status: "authed" as const } }
      : undefined,
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });

  if (persist) {
    let last = persistedUser ? JSON.stringify(persistedUser) : "";
    store.subscribe(() => {
      const { user } = store.getState().session as { user: SessionUser | null };
      const snapshot = user ? JSON.stringify(user) : "";
      if (snapshot !== last) {
        last = snapshot;
        persist.saveUser(user);
      }
    });
  }

  return { store, hooks, apis };
}

export type AppStore = ReturnType<typeof makeStore>["store"];
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
