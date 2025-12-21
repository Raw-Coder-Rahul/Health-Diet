import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMealsByDate, addMeal, deleteMeal } from "../../api";

export const fetchMealsByDate = createAsyncThunk(
  "meals/fetchByDate",
  async (date, { rejectWithValue }) => {
    try {
      const res = await getMealsByDate(date);
      return res.data?.meals || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch meals");
    }
  }
);

export const createMeal = createAsyncThunk(
  "meals/create",
  async (mealData, { rejectWithValue }) => {
    try {
      const res = await addMeal(mealData);
      return res.data?.meal;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add meal");
    }
  }
);

export const removeMeal = createAsyncThunk(
  "meals/remove",
  async (mealId, { rejectWithValue }) => {
    try {
      await deleteMeal(mealId);
      return mealId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete meal");
    }
  }
);

const mealSlice = createSlice({
  name: "meals",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMeals: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMealsByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealsByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMealsByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createMeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMeal.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeMeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMeal.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((meal) => meal._id !== action.payload);
      })
      .addCase(removeMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMeals } = mealSlice.actions;
export default mealSlice.reducer;