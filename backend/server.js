require('dotenv').config();
const express = require('express');
const connectDB = require('./db.js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
