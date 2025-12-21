import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  getAllWorkouts,
  getWorkoutsByDate,
  addWorkout,
  getUserDashboardStats,
  deleteWorkout,
  updateWorkout,
} from "../controllers/Workout.js";

const router = express.Router();

router.get("/all", verifyToken, getAllWorkouts);
router.get("/date", verifyToken, getWorkoutsByDate);
router.post("/add", verifyToken, addWorkout);
router.get("/stats", verifyToken, getUserDashboardStats);
router.put("/:id", verifyToken, updateWorkout);
router.delete("/:id", verifyToken, deleteWorkout);

export default router;