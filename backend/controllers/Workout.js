import Workout from '../models/Workout.js';
import User from '../models/User.js';
import { createError } from '../error.js';

const getDayBounds = (date) => {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
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
  const durationInMinutes = Number(duration) || 0;
  const weightInKg = Number(weight) || 70;
  const caloriesBurnedPerMinute = 5; // simple multiplier
  return Math.round(durationInMinutes * caloriesBurnedPerMinute * (weightInKg / 70));
};

export const getProfile = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (err) {
    next(err);
  }
};

export const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select('_id');
    if (!user) return next(createError(404, "User not found"));

    const queryDate = req.query.date ? new Date(req.query.date) : new Date();
    const { start, end } = getDayBounds(queryDate);

    const todayWorkouts = await Workout.find({
      userId,
      date: { $gte: start, $lt: end },
    }).sort({ date: -1 });

    const totalCaloriesBurned = todayWorkouts.reduce(
      (total, workout) => total + (workout.caloriesBurned || 0), 0
    );

    res.status(200).json({ todayWorkouts, totalCaloriesBurned });
  } catch (err) {
    next(err);
  }
};

export const addWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(createError(401, "Unauthorized"));

    const {
      category,
      workoutName,
      sets,
      reps,
      weight,
      duration,
      caloriesBurned,
      date,
    } = req.body;

    if (category && workoutName) {
      const payload = {
        userId,
        category: String(category).trim(),
        workoutName: String(workoutName).trim(),
        sets: isFinite(sets) ? Number(sets) : undefined,
        reps: isFinite(reps) ? Number(reps) : undefined,
        weight: isFinite(weight) ? Number(weight) : undefined,
        duration: isFinite(duration) ? Number(duration) : undefined,
        caloriesBurned: isFinite(caloriesBurned)
          ? Number(caloriesBurned)
          : calculateCaloriesBurned({ duration, weight }),
        date: date ? new Date(date) : new Date(),
      };

      const created = await Workout.create(payload);
      return res.status(201).json(created);
    }
    const { workoutString } = req.body;
    if (!workoutString) {
      return next(createError(400, "Provide either structured workout fields or workoutString"));
    }

    const lines = workoutString.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length < 6 || !lines[0].startsWith("#")) {
      return next(createError(400, "Invalid workoutString format"));
    }

    const categoryParsed = lines[0].substring(1).trim();
    const workoutNameParsed = lines[1];
    const durationParsed = Number(lines[2].toLowerCase().replace("min", "").trim());
    const setsParsed = Number(lines[3].toLowerCase().replace("sets", "").trim());
    const repsParsed = Number(lines[4].toLowerCase().replace("reps", "").trim());
    const weightParsed = Number(lines[5].toLowerCase().replace("kg", "").trim());

    if (!categoryParsed || !workoutNameParsed) {
      return next(createError(400, "Category and workoutName are required"));
    }

    const payload = {
      userId,
      category: categoryParsed,
      workoutName: workoutNameParsed,
      sets: isFinite(setsParsed) ? setsParsed : undefined,
      reps: isFinite(repsParsed) ? repsParsed : undefined,
      weight: isFinite(weightParsed) ? weightParsed : undefined,
      duration: isFinite(durationParsed) ? durationParsed : undefined,
      caloriesBurned: calculateCaloriesBurned({ duration: durationParsed, weight: weightParsed }),
      date: new Date(),
    };

    const created = await Workout.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const getUserDashboardStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return next(createError(404, 'User not found'));

    const today = new Date();
    const { start: startToday, end: endToday } = getDayBounds(today);

    // Today totals
    const todayAgg = await Workout.aggregate([
      { $match: { userId: req.user.id, date: { $gte: startToday, $lt: endToday } } },
      { $group: {
        _id: null,
        totalCaloriesBurned: { $sum: { $ifNull: ['$caloriesBurned', 0] } },
        totalWorkouts: { $sum: 1 }
      } }
    ]);
    const todayStats = todayAgg[0] || { totalCaloriesBurned: 0, totalWorkouts: 0 };
    const avgCaloriesBurnedPerWorkout =
      todayStats.totalWorkouts > 0
        ? Math.round(todayStats.totalCaloriesBurned / todayStats.totalWorkouts)
        : 0;

    const categoryAgg = await Workout.aggregate([
      { $match: { userId: req.user.id, date: { $gte: startToday, $lt: endToday } } },
      { $group: { _id: '$category', totalCaloriesBurned: { $sum: { $ifNull: ['$caloriesBurned', 0] } } } },
      { $sort: { totalCaloriesBurned: -1 } }
    ]);
    const pieChartData = categoryAgg.map((c, idx) => ({
      id: idx,
      value: c.totalCaloriesBurned,
      label: c._id,
    }));

    const weeks = [];
    const caloriesBurned = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const { start, end } = getDayBounds(d);

      const dayAgg = await Workout.aggregate([
        { $match: { userId: req.user.id, date: { $gte: start, $lt: end } } },
        { $group: { _id: null, totalCaloriesBurned: { $sum: { $ifNull: ['$caloriesBurned', 0] } } } }
      ]);
      const dayTotal = dayAgg[0]?.totalCaloriesBurned ?? 0;

      weeks.push(`${getDayWithSuffix(d.getDate())} ${monthNames[d.getMonth()]}`);
      caloriesBurned.push(dayTotal);
    }

    res.status(200).json({
      success: true,
      user,
      stats: {
        totalCaloriesBurned: todayStats.totalCaloriesBurned,
        totalWorkouts: todayStats.totalWorkouts,
        avgCaloriesBurnedPerWorkout,
        weekly: { weeks, caloriesBurned },
        pieChartData,
      },
    });
  } catch (err) {
    next(err);
  }
};