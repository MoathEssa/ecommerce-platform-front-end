import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse } from "@shared/types";
import authStorageService from "../services/authStorageService";

// ── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: AuthResponse | null;
  accessToken: string | null;
  isAuthChecked: boolean;
}

// ── Slice ────────────────────────────────────────────────────────────────────

const stored = authStorageService.load();

const initialState: AuthState = {
  user: stored?.user ?? null,
  accessToken: stored?.accessToken ?? null,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: AuthResponse; accessToken: string }>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      authStorageService.save(action.payload);
    },
    setAuthChecked(state, action: PayloadAction<AuthResponse | null>) {
      state.isAuthChecked = true;
      if (action.payload) {
        state.user = action.payload;
      }
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthChecked = true;
      authStorageService.clear();
    },
    /** Dispatched by the RTK notification middleware on 401 responses */
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthChecked = true;
      authStorageService.clear();
    },
  },
});

export const { setCredentials, setAuthChecked, clearAuth, logout } =
  authSlice.actions;
export default authSlice.reducer;
