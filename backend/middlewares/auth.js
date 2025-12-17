// backend/middlewares/auth.js
import jwt from 'jsonwebtoken';
import { createError } from '../error.js';

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Expecting header format: "Bearer <token>"
  if (!authHeader) {
    return next(createError(401, 'Access denied. No token provided.'));
  }

  const token = authHeader.split(' ')[1]; // Extract token after "Bearer"

  if (!token) {
    return next(createError(401, 'Access denied. Invalid token format.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload (e.g., { id: user._id }) to request
    next();
  } catch (err) {
    return next(createError(403, 'Invalid or expired token.'));
  }
};