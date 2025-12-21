import mongoose from 'mongoose';

const WorkoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    workoutName: {
      type: String,
      required: true,
      trim: true,
    },
    sets: {
      type: Number,
      default: 0,
      min: [0, 'Sets cannot be negative'],
    },
    reps: {
      type: Number,
      default: 0,
      min: [0, 'Reps cannot be negative'],
    },
    weight: {
      type: Number,
      default: 0,
      min: [0, 'Weight cannot be negative'],
    },
    duration: {
      type: Number, // minutes
      default: 0,
      min: [0, 'Duration cannot be negative'],
    },
    caloriesBurned: {
      type: Number,
      default: 0,
      min: [0, 'Calories burned cannot be negative'],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

WorkoutSchema.index({ userId: 1, workoutName: 1, date: 1 });
WorkoutSchema.index({ userId: 1, date: 1 });
WorkoutSchema.virtual('totalVolume').get(function () {
  return this.sets * this.reps * this.weight;
});

const Workout =
  mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema);

export default Workout;