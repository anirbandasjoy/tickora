import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./services/api";
import { authReducer } from "./features/auth/auth-slice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
