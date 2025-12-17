// backend/controllers/User.js
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import { createError } from '../error.js';

dotenv.config();

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password, age } = req.body;
    const newUser = new User({ fullName, email, password, age });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(createError(404, 'User not found'));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(createError(400, 'Invalid credentials'));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

// Get user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return next(createError(404, 'User not found'));
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!user) return next(createError(404, 'User not found'));
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};