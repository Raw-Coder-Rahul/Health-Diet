import mongoose from 'mongoose';
import Workout from '../models/Workout.js';
import User from '../models/User.js';
import { createError } from '../error.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getDayBounds = (date) => {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
  return { start, end };
};

const getDayWithSuffix = (day) => {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
};

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const calculateCaloriesBurned = ({ duration = 0, weight = 70 }) => {
  const durationInMinutes = Number.isFinite(Number(duration)) ? Number(duration) : 0;
  const weightInKg = Number.isFinite(Number(weight)) ? Number(weight) : 70;
  const caloriesBurnedPerMinute = 5;
  return Math.round(durationInMinutes * caloriesBurnedPerMinute * (weightInKg / 70));
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId || !isValidObjectId(userId)) return next(createError(401, 'Unauthorized'));

    const workouts = await Workout.find({ userId }).sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (err) {
    next(err);
  }
};

export const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId || !isValidObjectId(userId)) return next(createError(401, 'Unauthorized'));

    const userExists = await User.exists({ _id: userId });
    if (!userExists) return next(createError(404, 'User not found'));

    const dateStr = req.query.date; // expected: YYYY-MM-DD
    const queryDate = dateStr ? new Date(dateStr) : new Date();
    if (Number.isNaN(queryDate.getTime())) {
      return next(createError(400, 'Invalid date'));
    }

    const { start, end } = getDayBounds(queryDate);

    const todayWorkouts = await Workout.find({
      userId,
      date: { $gte: start, $lt: end },
    }).sort({ date: -1 });

    const totalCaloriesBurned = todayWorkouts.reduce(
      (total, w) => total + (Number.isFinite(Number(w.caloriesBurned)) ? Number(w.caloriesBurned) : 0),
      0
    );

    res.status(200).json({ todayWorkouts, totalCaloriesBurned });
  } catch (err) {
    next(err);
  }
};

export const addWorkout = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId || !isValidObjectId(userId)) return next(createError(401, "Unauthorized"));

    const {
      category,
      workoutName,
      sets,
      reps,
      weight,
      duration,
      caloriesBurned,
      date,
      workoutString,
    } = req.body;

    if (category && workoutName) {
      const setsNum = Number(sets);
      const repsNum = Number(reps);
      const weightNum = Number(weight);
      const durationNum = Number(duration);
      const caloriesNum = Number(caloriesBurned);

      const safeWeight = Number.isFinite(weightNum) ? weightNum : 70;
      const workoutDate = date ? new Date(date) : new Date();
      const { start, end } = getDayBounds(workoutDate);

      const existingWorkout = await Workout.findOne({
        userId,
        category: String(category).trim(),
        workoutName: String(workoutName).trim(),
        date: { $gte: start, $lt: end },
      });

      if (existingWorkout) {
        existingWorkout.sets += Number.isFinite(setsNum) ? setsNum : 0;
        existingWorkout.reps += Number.isFinite(repsNum) ? repsNum : 0;
        existingWorkout.duration += Number.isFinite(durationNum) ? durationNum : 0;
        existingWorkout.weight = Number.isFinite(weightNum) ? weightNum : existingWorkout.weight;
        existingWorkout.caloriesBurned += Number.isFinite(caloriesNum)
          ? caloriesNum
          : calculateCaloriesBurned({ duration: durationNum, weight: safeWeight });

        await existingWorkout.save();
        return res.status(200).json(existingWorkout);
      }

      const payload = {
        userId,
        category: String(category).trim(),
        workoutName: String(workoutName).trim(),
        sets: Number.isFinite(setsNum) ? setsNum : 0,
        reps: Number.isFinite(repsNum) ? repsNum : 0,
        weight: Number.isFinite(weightNum) ? weightNum : 0,
        duration: Number.isFinite(durationNum) ? durationNum : 0,
        caloriesBurned: Number.isFinite(caloriesNum)
          ? caloriesNum
          : calculateCaloriesBurned({ duration: durationNum, weight: safeWeight }),
        date: workoutDate,
      };

      const created = await Workout.create(payload);
      return res.status(201).json(created);
    }

    if (!workoutString) {
      return next(createError(400, "Provide either structured workout fields or workoutString"));
    }

    const lines = workoutString.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 6 || !lines[0].startsWith("#")) {
      return next(createError(400, "Invalid workoutString format"));
    }

    const categoryParsed = lines[0].substring(1).trim();
    const workoutNameParsed = lines[1];
    const durationParsed = parseInt(lines[2].replace(/[^0-9]/g, ""), 10);
    const setsParsed = parseInt(lines[3].replace(/[^0-9]/g, ""), 10);
    const repsParsed = parseInt(lines[4].replace(/[^0-9]/g, ""), 10);
    const weightParsed = parseInt(lines[5].replace(/[^0-9]/g, ""), 10);

    if (!categoryParsed || !workoutNameParsed) {
      return next(createError(400, "Category and workoutName are required"));
    }

    const safeWeightParsed = Number.isFinite(weightParsed) ? weightParsed : 70;
    const workoutDate = new Date();
    const { start, end } = getDayBounds(workoutDate);

    const existingWorkout = await Workout.findOne({
      userId,
      category: categoryParsed,
      workoutName: workoutNameParsed,
      date: { $gte: start, $lt: end },
    });

    if (existingWorkout) {
      existingWorkout.sets += Number.isFinite(setsParsed) ? setsParsed : 0;
      existingWorkout.reps += Number.isFinite(repsParsed) ? repsParsed : 0;
      existingWorkout.duration += Number.isFinite(durationParsed) ? durationParsed : 0;
      existingWorkout.weight = Number.isFinite(weightParsed) ? weightParsed : existingWorkout.weight;
      existingWorkout.caloriesBurned += calculateCaloriesBurned({
        duration: durationParsed,
        weight: safeWeightParsed,
      });

      await existingWorkout.save();
      return res.status(200).json(existingWorkout);
    }

    const payload = {
      userId,
      category: categoryParsed,
      workoutName: workoutNameParsed,
      sets: Number.isFinite(setsParsed) ? setsParsed : 0,
      reps: Number.isFinite(repsParsed) ? repsParsed : 0,
      weight: Number.isFinite(weightParsed) ? weightParsed : 0,
      duration: Number.isFinite(durationParsed) ? durationParsed : 0,
      caloriesBurned: calculateCaloriesBurned({ duration: durationParsed, weight: safeWeightParsed }),
      date: workoutDate,
    };

    const created = await Workout.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const getUserDashboardStats = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId || !isValidObjectId(userId)) return next(createError(401, 'Unauthorized'));

    const user = await User.findById(userId).select('-password');
    if (!user) return next(createError(404, 'User not found'));

    const today = new Date();
    const { start: startToday, end: endToday } = getDayBounds(today);

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const todayAgg = await Workout.aggregate([
      { $match: { userId: userObjectId, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: null,
          totalCaloriesBurned: { $sum: { $ifNull: ['$caloriesBurned', 0] } },
          totalWorkouts: { $sum: 1 },
        },
      },
    ]);

    const todayStats = todayAgg[0] || { totalCaloriesBurned: 0, totalWorkouts: 0 };
    const avgCaloriesBurnedPerWorkout =
      todayStats.totalWorkouts > 0
        ? Math.round(todayStats.totalCaloriesBurned / todayStats.totalWorkouts)
        : 0;

    const categoryAgg = await Workout.aggregate([
      { $match: { userId: userObjectId, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: '$category',
          totalCaloriesBurned: { $sum: { $ifNull: ['$caloriesBurned', 0] } },
        },
      },
      { $sort: { totalCaloriesBurned: -1 } },
    ]);

    const pieChartData = categoryAgg.map((c, idx) => ({
      id: idx,
      value: c.totalCaloriesBurned,
      label: c._id,
    }));

    const weeks = [];
    const caloriesBurned = [];
    const workoutsCount = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const { start, end } = getDayBounds(d);

      const dayAgg = await Workout.aggregate([
        { $match: {
            userId: userObjectId,
            date: { $gte: start, $lt: end } 
          }
        },
        {
          $group: {
            _id: null,
            totalCaloriesBurned: { $sum: { $ifNull: ['$caloriesBurned', 0] } },
            totalWorkouts: { $sum: 1 },
          },
        },
      ]);

      const dayTotalCalories = dayAgg.length > 0 ? dayAgg[0].totalCaloriesBurned : 0;
      const dayTotalWorkouts = dayAgg.length > 0 ? dayAgg[0].totalWorkouts : 0;

      weeks.push(`${getDayWithSuffix(d.getDate())} ${monthNames[d.getMonth()]}`);
      caloriesBurned.push(dayTotalCalories);
      workoutsCount.push(dayTotalWorkouts);
    }

    res.status(200).json({
      success: true,
      user,
      stats: {
        totalCaloriesBurned: todayStats.totalCaloriesBurned,
        totalWorkouts: todayStats.totalWorkouts,
        avgCaloriesBurnedPerWorkout,
        weekly: { weeks, caloriesBurned, workoutsCount },
        pieChartData,
      },
    });
  } catch (err) {
    next(err);
  }
};