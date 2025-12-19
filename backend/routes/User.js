import express from 'express';
import { register, login, updateProfile, getProfile } from '../controllers/User.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

export default router;