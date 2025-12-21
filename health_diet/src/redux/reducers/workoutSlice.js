// redux/reducers/workoutSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workouts: [],
  stats: null,
};

export const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setWorkouts: (state, action) => {
      state.workouts = action.payload;
    },
    addWorkoutSuccess: (state, action) => {
      state.workouts.push(action.payload);
      if (state.stats) {
        const type = action.payload.type;
        state.stats[type] = (state.stats[type] || 0) + 1;
      }
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    clearWorkouts: (state) => {
      state.workouts = [];
      state.stats = null;
    },
  },
});

export const { setWorkouts, addWorkoutSuccess, setStats, clearWorkouts } =
  workoutSlice.actions;
export default workoutSlice.reducer;