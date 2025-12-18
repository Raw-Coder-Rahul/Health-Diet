import Workout from '../models/Workout.js';
import User from '../models/User.js';
import { createError } from '../error.js';

function getDayWithSuffix(day) {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}
const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return next(createError(404, 'User not found'));

    const today = new Date();
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const totalCaloriesBurned = await Workout.aggregate([
      { $match: { userId: req.user.id, date: { $gte: startToday, $lt: endToday } } },
      { $group: { _id: null, totalCaloriesBurned: { $sum: '$caloriesBurned' } } }
    ]);

    const totalWorkouts = await Workout.countDocuments({
      userId: req.user.id,
      date: { $gte: startToday, $lt: endToday }
    });

    const avgCaloriesPerWorkout =
      totalWorkouts > 0 ? totalCaloriesBurned[0]?.totalCaloriesBurned / totalWorkouts : 0;

    const categoryCalories = await Workout.aggregate([
      { $match: { userId: req.user.id, date: { $gte: startToday, $lt: endToday } } },
      { $group: { _id: '$category', totalCaloriesBurned: { $sum: '$caloriesBurned' } } }
    ]);

    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurned,
      label: category._id,
    }));

    const weeks = [];
    const caloriesBurned = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      weeks.push(`${getDayWithSuffix(day.getDate())} ${monthNames[day.getMonth()]}`);

      const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const endOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);

      const dayCalories = await Workout.aggregate([
        { $match: { userId: req.user.id, date: { $gte: startOfDay, $lt: endOfDay } } },
        { $group: { _id: null, totalCaloriesBurned: { $sum: '$caloriesBurned' } } }
      ]);

      caloriesBurned.push(dayCalories[0]?.totalCaloriesBurned || 0);
    }

    res.status(200).json({
      success: true,
      user,
      stats: {
        totalCaloriesBurned: totalCaloriesBurned[0]?.totalCaloriesBurned || 0,
        totalWorkouts,
        avgCaloriesPerWorkout,
        weekly: { weeks, caloriesBurned },
        pieChartData,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found"));

    let date = req.query.date ? new Date(req.query.date) : new Date();
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    const todayWorkouts = await Workout.find({
      userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    const totalCaloriesBurned = todayWorkouts.reduce(
      (total, workout) => total + workout.caloriesBurned, 0
    );

    return res.status(200).json({ todayWorkouts, totalCaloriesBurned });
  } catch (err) {
    next(err);
  }
};

export const addWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { workoutString } = req.body;
    if (!workoutString) return next(createError(400, "Workout string is missing"));

    const eachworkout = workoutString.split(";").map((line) => line.trim());
    const categories = eachworkout.filter((line) => line.startsWith("#"));
    if (categories.length === 0) return next(createError(400, "No Categories found in workout string"));

    const parsedWorkouts = [];

    for (let line of eachworkout) {
      if (line.startsWith("#")) {
        const parts = line.split("\n").map((part) => part.trim());
        if (parts.length < 5) return next(createError(400, "Workout string is incomplete"));

        const workoutDetails = parsedWorkoutLine(parts);
        if (!workoutDetails) return next(createError(400, "Invalid workout format"));

        workoutDetails.category = parts[0].substring(1).trim();
        workoutDetails.caloriesBurned = calculateCaloriesBurned(workoutDetails);

        parsedWorkouts.push(workoutDetails);
        await Workout.create({ ...workoutDetails, userId });
      }
    }

    res.status(201).json({ success: true, message: 'Workout added successfully', workouts: parsedWorkouts });
  } catch (err) {
    next(err);   // ✅ completed catch block
  }
};

const parsedWorkoutLine = (parts) => {
  try {
    const details = {};
    // Example format:
    // parts[0] = "#Category"
    // parts[1] = "WorkoutName"
    // parts[2] = "3 sets 12 reps"
    // parts[3] = "50 kg"
    // parts[4] = "30 min"

    details.workoutName = parts[1];
    const setsReps = parts[2].toLowerCase();
    details.sets = parseInt(setsReps.split("sets")[0].trim());
    details.reps = parseInt(setsReps.split("sets")[1].split("reps")[0].trim());
    details.weight = parseFloat(parts[3].toLowerCase().replace("kg", "").trim());
    details.duration = parseFloat(parts[4].toLowerCase().replace("min", "").trim());

    return details;
  } catch (err) {
    return null;
  }
};

const calculateCaloriesBurned = (workoutDetails) => {
  const durationInMinutes = parseInt(workoutDetails.duration);
  const weightInKg = parseInt(workoutDetails.weight);
  const caloriesBurnedPerMinute = 5; // simple multiplier
  return durationInMinutes * caloriesBurnedPerMinute * (weightInKg / 70); 
};