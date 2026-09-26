"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, persistAuth, type AppStore } from "@/lib/redux/store";
import { SessionSync } from "./session-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) storeRef.current = makeStore();

  useEffect(() => {
    const store = storeRef.current;
    if (!store) return;
    return store.subscribe(() => persistAuth(store.getState().auth));
  }, []);

  return (
    <Provider store={storeRef.current}>
      <SessionSync>{children}</SessionSync>
    </Provider>
  );
}
