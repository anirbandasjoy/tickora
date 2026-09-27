"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { SessionSync } from "./session-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionSync>{children}</SessionSync>
    </Provider>
  );
}
