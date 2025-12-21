import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/reducers/userSlice";
import { history } from "../utills/navigation";

const API = axios.create({
  baseURL: "http://localhost:5047/api/",
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
    return Promise.reject(error);
  }
);

export const UserSignup = (data) => API.post("users/register", data);
export const UserSignIn = (data) => API.post("users/login", data);

export const getUserProfile = () => API.get("users/profile");
export const updateUserProfile = (data) => API.put("users/profile", data);

export const getAllWorkouts = () => API.get("workouts/all");
export const getWorkoutsByDate = (date) => API.get(`workouts/date?date=${date}`);
export const addWorkout = (workoutData) => API.post("workouts/add", workoutData);
export const getWorkoutStats = () => API.get("workouts/stats");

export default API;