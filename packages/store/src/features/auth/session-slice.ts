import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SessionUser } from "@repo/database";

export type SessionStatus = "idle" | "loading" | "authed" | "guest";

export interface SessionState {
  user: SessionUser | null;
  status: SessionStatus;
}

const initialState: SessionState = { user: null, status: "idle" };

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<SessionUser>) => {
      state.user = action.payload;
      state.status = "authed";
    },
    clearSession: (state) => {
      state.user = null;
      state.status = "guest";
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
export const selectSessionUser = (state: { session: SessionState }) => state.session.user;
export const selectSessionStatus = (state: { session: SessionState }) => state.session.status;
