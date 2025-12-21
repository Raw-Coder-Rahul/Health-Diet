import Meal from "../models/Meal.js";
import { createError } from "../error.js";

export const addMeal = async (req, res, next) => {
  try {
    const { type, foodItem, quantity, calories, protein, fat, vitamins, carbs } = req.body;

    if (!type || !foodItem || !quantity || !calories) {
      return next(createError(400, "Type, foodItem, quantity, and calories are required"));
    }

    const meal = new Meal({
      userId: req.userId,
      type,
      foodItem,
      quantity,
      calories,
      protein: protein || 0,
      fat: fat || 0,
      vitamins: vitamins || 0,
      carbs: carbs || 0,
      date: new Date(),
    });

    await meal.save();
    res.status(201).json({ success: true, meal });
  } catch (err) {
    next(err);
  }
};

export const getMealsByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return next(createError(400, "Date is required"));

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      userId: req.userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    res.status(200).json({ success: true, meals });
  } catch (err) {
    next(err);
  }
};

export const getAllMeals = async (req, res, next) => {
  try {
    const meals = await Meal.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json({ success: true, meals });
  } catch (err) {
    next(err);
  }
};

export const updateMeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const meal = await Meal.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: updates },
      { new: true }
    );

    if (!meal) return next(createError(404, "Meal not found"));

    res.status(200).json({ success: true, meal });
  } catch (err) {
    next(err);
  }
};

export const deleteMeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const meal = await Meal.findOneAndDelete({ _id: id, userId: req.userId });

    if (!meal) return next(createError(404, "Meal not found"));

    res.status(200).json({ success: true, message: "Meal deleted", meal });
  } catch (err) {
    next(err);
  }
};