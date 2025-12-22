import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/reducers/userSlice";
import { history } from "../utills/navigation";

const API = axios.create({
  // baseURL: "http://localhost:5047/api/",
  baseURL: "https://health-diet-backend.onrender.com",
});

API.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      console.warn("Unauthorized — logging out and redirecting to login");
      history.push("/login");
    }
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const userSignup = (data) => API.post("users/register", data);
export const userSignIn = (data) => API.post("users/login", data);

export const getUserProfile = () => API.get("users/profile");

export const updateUserProfile = (data) => {
  const formData = new FormData();

  if (data.name) formData.append("fullName", data.name);
  if (data.email) formData.append("email", data.email);
  if (data.age) formData.append("age", data.age);
  if (data.profileImage) formData.append("profileImage", data.profileImage);

  return API.put("users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAllWorkouts = () => API.get("workouts/all");
export const getWorkoutsByDate = (date) => API.get(`workouts/date?date=${date}`);

export const addWorkout = (workoutData) =>
  API.post("workouts/add", workoutData, {
    headers: { "Content-Type": "application/json" },
  });

export const updateWorkout = (id, workoutData) =>
  API.put(`workouts/${id}`, workoutData, {
    headers: { "Content-Type": "application/json" },
  });

export const deleteWorkout = (id) => API.delete(`workouts/${id}`);
export const getWorkoutStats = () => API.get("workouts/stats");

export const addMeal = (mealData) =>
  API.post("meals/add", mealData, {
    headers: { "Content-Type": "application/json" },
  });

export const getMealsByDate = (date) => API.get(`meals/date?date=${date}`);
export const getAllMeals = () => API.get("meals/all");
export const deleteMeal = (id) => API.delete(`meals/${id}`);

export default API;