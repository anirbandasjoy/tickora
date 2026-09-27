import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "@/lib/auth-client";
import { authApi } from "@/lib/redux/services/api";

type AuthStatus = "idle" | "loading" | "authed" | "guest";

export interface AuthState {
  user: Session["user"] | null;
  status: AuthStatus;
}

const initialState: AuthState = { user: null, status: "idle" };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Session>) => {
      state.user = action.payload.user;
      state.status = "authed";
    },
    clearSession: (state) => {
      state.user = null;
      state.status = "guest";
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.getMe.matchPending, (state) => {
        if (state.status === "idle") state.status = "loading";
      })
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.status = "authed";
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        state.user = null;
        state.status = "guest";
      });
  },
});

export const { setCredentials, clearSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
