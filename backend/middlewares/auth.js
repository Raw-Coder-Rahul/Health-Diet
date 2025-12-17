import jwt from 'jsonwebtoken';
import { createError } from '../error.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return next(createError(401, 'Access denied. No token provided.'));
  }

  const token = authHeader.split(' ')[1]; 

  if (!token) {
    return next(createError(401, 'Access denied. Invalid token format.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return next(createError(403, 'Invalid or expired token.'));
  }
};