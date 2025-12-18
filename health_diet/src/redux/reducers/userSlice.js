import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  token: localStorage.getItem("health&Diet_token") || null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("health&Diet_token", action.payload.token);
    },
    loginFailure: (state) => {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem("health&Diet_token");
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem("health&Diet_token");
    },
  },
});

export const { loginSuccess, loginFailure, logout } = userSlice.actions;

export default userSlice.reducer;