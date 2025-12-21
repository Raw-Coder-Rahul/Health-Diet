import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
  token: localStorage.getItem("token") || null,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload?.user ?? null;
      state.token = action.payload?.token ?? null;
      state.error = null;
      // persist to localStorage
      if (state.token) {
        localStorage.setItem("token", state.token);
      }
      if (state.currentUser) {
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      }
    },
    loginFailure: (state, action) => {
      state.error = action.payload || "Login failed";
      state.currentUser = null;
      state.token = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout, clearUser } = userSlice.actions;
export default userSlice.reducer;