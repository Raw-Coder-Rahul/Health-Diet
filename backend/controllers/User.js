import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createError } from '../error.js';

dotenv.config();

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password, age = null } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, 'Email already registered'));
    }

    const newUser = new User({ fullName, email, password, age });
    await newUser.save();

    if (!process.env.JWT_SECRET) {
      return next(createError(500, 'JWT_SECRET is not defined'));
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        age: newUser.age,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(createError(400, 'Email already registered'));
    }
    next(err);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(createError(404, 'This Email is Wrong!'));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(createError(400, 'Password is Wrong!'));

    if (!process.env.JWT_SECRET) {
      return next(createError(500, 'JWT_SECRET is not defined'));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return next(createError(404, 'User not found'));
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select('-password');
    if (!user) return next(createError(404, 'User not found'));
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};