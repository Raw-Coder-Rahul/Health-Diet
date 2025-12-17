// backend/models/Workout.js
import mongoose from 'mongoose';

const WorkoutSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    sets: { type: Number },
    reps: { type: Number },
    weight: { type: Number },
    duration: { type: Number },
    caloriesBurned: { type: Number },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Workout = mongoose.model('Workout', WorkoutSchema);

export default Workout;   // <-- ESM default export