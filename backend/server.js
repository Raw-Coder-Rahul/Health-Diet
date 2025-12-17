import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db.js';
import cors from 'cors';
import userRoutes from './routes/User.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running...' });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  // Log stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    status,
    message,
  });
});

const PORT = process.env.PORT || 5000;
const server = async () => {
  try {
    connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
};

server();