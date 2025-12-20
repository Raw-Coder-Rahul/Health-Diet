import express from 'express';
import { getProfile, getWorkoutsByDate, addWorkout, getUserDashboardStats } from '../controllers/Workout.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/profile', verifyToken, getProfile);
router.get('/date', verifyToken, getWorkoutsByDate);
router.post('/add', verifyToken, addWorkout);
router.get('/stats', verifyToken, getUserDashboardStats);

export default router;