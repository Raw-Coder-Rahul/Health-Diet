import jwt from 'jsonwebtoken';
import { createError } from '../error.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return next(createError(401, 'Access denied. No token provided.'));
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return next(createError(401, 'Access denied. Invalid token format.'));
  }

  const token = parts[1];

  try {
    if (!process.env.JWT_SECRET) {
      return next(createError(500, 'JWT_SECRET is not defined'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(createError(403, 'Invalid or expired token.'));
  }
};