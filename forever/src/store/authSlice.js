import { createSlice } from "@reduxjs/toolkit";
import { clearStoredUser, getStoredUser, setStoredUser } from "./authStorage";
import { clearAccessToken } from "./tokenStorage";

const initialUser = getStoredUser();

const initialState = {
  user: initialUser,
  isAuthenticated: Boolean(initialUser),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action) {
      const user = action.payload?.user ?? null;
      state.user = user;
      state.isAuthenticated = Boolean(user);
      if (user) setStoredUser(user);
    },
    clearSession(state) {
      state.user = null;
      state.isAuthenticated = false;
      clearStoredUser();
      clearAccessToken();
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;

