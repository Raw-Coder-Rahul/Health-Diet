import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getWorkoutStats,
  getWorkoutsByDate,
  addWorkout,
  deleteWorkout,
  updateWorkout,
} from "../../api";

export const fetchWorkoutStats = createAsyncThunk(
  "workouts/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getWorkoutStats();
      return res.data?.stats || null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch workout stats"
      );
    }
  }
);

export const fetchWorkoutsByDate = createAsyncThunk(
  "workouts/fetchByDate",
  async (date, { rejectWithValue }) => {
    try {
      const res = await getWorkoutsByDate(date);
      return res.data?.todayWorkouts || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch workouts"
      );
    }
  }
);

export const createWorkout = createAsyncThunk(
  "workouts/create",
  async (workoutData, { rejectWithValue }) => {
    try {
      const res = await addWorkout(workoutData);
      return res.data?.workout || null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add workout"
      );
    }
  }
);

export const editWorkout = createAsyncThunk(
  "workouts/edit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateWorkout(id, data);
      return res.data?.workout || null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update workout"
      );
    }
  }
);

export const removeWorkout = createAsyncThunk(
  "workouts/remove",
  async (workoutId, { rejectWithValue }) => {
    try {
      const res = await deleteWorkout(workoutId);
      return res.data?.deletedId || workoutId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete workout"
      );
    }
  }
);

// --- Slice ---
const workoutSlice = createSlice({
  name: "workouts",
  initialState: {
    stats: null,
    items: [],
    loadingStats: false,
    loadingItems: false,
    loadingCreate: false,
    loadingEdit: false,
    loadingRemove: false,
    error: null,
  },
  reducers: {
    clearWorkouts: (state) => {
      state.items = [];
      state.stats = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchWorkoutStats.pending, (state) => {
        state.loadingStats = true;
        state.error = null;
      })
      .addCase(fetchWorkoutStats.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchWorkoutStats.rejected, (state, action) => {
        state.loadingStats = false;
        state.error = action.payload;
      })

      // Workouts by date
      .addCase(fetchWorkoutsByDate.pending, (state) => {
        state.loadingItems = true;
        state.error = null;
      })
      .addCase(fetchWorkoutsByDate.fulfilled, (state, action) => {
        state.loadingItems = false;
        state.items = action.payload;
      })
      .addCase(fetchWorkoutsByDate.rejected, (state, action) => {
        state.loadingItems = false;
        state.error = action.payload;
      })

      // Create workout
      .addCase(createWorkout.pending, (state) => {
        state.loadingCreate = true;
        state.error = null;
      })
      .addCase(createWorkout.fulfilled, (state, action) => {
        state.loadingCreate = false;
        if (action.payload) state.items.push(action.payload);
      })
      .addCase(createWorkout.rejected, (state, action) => {
        state.loadingCreate = false;
        state.error = action.payload;
      })

      // Edit workout
      .addCase(editWorkout.pending, (state) => {
        state.loadingEdit = true;
        state.error = null;
      })
      .addCase(editWorkout.fulfilled, (state, action) => {
        state.loadingEdit = false;
        if (action.payload) {
          state.items = state.items.map((w) =>
            w._id === action.payload._id ? action.payload : w
          );
        }
      })
      .addCase(editWorkout.rejected, (state, action) => {
        state.loadingEdit = false;
        state.error = action.payload;
      })

      // Remove workout
      .addCase(removeWorkout.pending, (state) => {
        state.loadingRemove = true;
        state.error = null;
      })
      .addCase(removeWorkout.fulfilled, (state, action) => {
        state.loadingRemove = false;
        if (action.payload) {
          state.items = state.items.filter((w) => w._id !== action.payload);
        }
      })
      .addCase(removeWorkout.rejected, (state, action) => {
        state.loadingRemove = false;
        state.error = action.payload;
      });
  },
});

export const { clearWorkouts } = workoutSlice.actions;
export default workoutSlice.reducer;