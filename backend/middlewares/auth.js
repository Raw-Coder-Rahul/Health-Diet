import jwt from 'jsonwebtoken';
import { createError } from '../error.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.get('Authorization');

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.userId = decoded.id || decoded.userId;
    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(createError(401, 'Token expired.'));
    }
    return next(createError(401, 'Invalid token.'));
  }
};