import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization?.trim();

  if (!authHeader) {
    return next(createError(401, "Access denied. No token provided."));
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(createError(401, "Access denied. Invalid token format."));
  }

  if (!process.env.JWT_SECRET) {
    return next(createError(500, "JWT_SECRET is not defined in environment variables."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    req.user = decoded;
    req.userId = decoded.id || decoded.userId;

    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(createError(401, "Token expired."));
    }
    return next(createError(401, "Invalid token."));
  }
};