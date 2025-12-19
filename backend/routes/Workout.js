import express from 'express';
import { getProfile, getWorkoutsByDate, addWorkout } from '../controllers/Workout.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/profile', verifyToken, getProfile);
router.get('/date', verifyToken, getWorkoutsByDate);
router.post('/add', verifyToken, addWorkout);

export default router;