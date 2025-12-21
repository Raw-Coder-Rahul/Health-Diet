import express from 'express';
import {
  getProfile,          // returns all workouts for a user
  getWorkoutsByDate,
  addWorkout,
  getUserDashboardStats
} from '../controllers/Workout.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/all', verifyToken, getProfile);
router.get('/date', verifyToken, getWorkoutsByDate); 
router.post('/add', verifyToken, addWorkout);
router.get('/stats', verifyToken, getUserDashboardStats);

export default router;