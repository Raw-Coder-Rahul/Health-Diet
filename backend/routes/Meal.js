import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  addMeal,
  getMealsByDate,
  getAllMeals,
  deleteMeal,
} from "../controllers/Meal.js";

const router = express.Router();

router.post("/add", verifyToken, addMeal);

router.get("/date", verifyToken, (req, res, next) => {
  if (!req.query.date) {
    return res.status(400).json({
      success: false,
      message: "Date query parameter is required",
    });
  }
  return getMealsByDate(req, res, next);
});

router.get("/all", verifyToken, getAllMeals);
router.delete("/:id", verifyToken, deleteMeal);

export default router;