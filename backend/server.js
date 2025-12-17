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
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running...' });
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