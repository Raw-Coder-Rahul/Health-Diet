import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state) => {
      state.currentUser = null;
      state.token = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout, clearUser } = userSlice.actions;
export default userSlice.reducer;