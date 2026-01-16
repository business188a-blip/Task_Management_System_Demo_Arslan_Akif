import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', tasksRouter);

// Connect DB and start server
const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
