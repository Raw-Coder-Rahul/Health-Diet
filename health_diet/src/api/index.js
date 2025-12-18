import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5047/api/",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("health&Diet_token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const UserSignup = (data) => API.post("users/register", data);
export const UserSignIn = (data) => API.post("users/login", data);
export const getUserProfile = () => API.get("users/profile");
export const updateUserProfile = (data) => API.put("users/profile", data);

export const getWorkoutProfile = () => API.get("workouts/profile");
export const getWorkoutsByDate = (date) => API.get(`workouts/date?date=${date}`);
export const addWorkout = (workoutString) =>
  API.post("workouts/add", { workoutString });

export default API;