import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import fs from "fs";
import path from "path";
import morgan from "morgan";

import userRoutes from "./routes/User.js";
import workoutRoutes from "./routes/Workout.js";
import mealRoutes from "./routes/Meal.js";

dotenv.config();

const app = express();

// new
const allowedOrigins = [
  "https://health-diet.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// end

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "*",
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(uploadsDir));

app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/meals", mealRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running..." });
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    status,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    const connection = await connectDB(process.env.MONGO_URL);

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = () => {
      console.log("Shutting down server...");
      server.close(() => {
        if (connection && connection.disconnect) {
          connection.disconnect();
        }
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("Error starting server:", err.message);
    process.exit(1);
  }
};

startServer();