import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/init.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import investmentRoutes from './routes/investments.js';
import livestockRoutes from './routes/livestock.js';
import taskRoutes from './routes/tasks.js';
import timelineRoutes from './routes/timeline.js';
import reportRoutes from './routes/reports.js';
import notificationRoutes from './routes/notifications.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes protégées
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/investments', authenticateToken, investmentRoutes);
app.use('/api/livestock', authenticateToken, livestockRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/timeline', authenticateToken, timelineRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes);

// Gestion des erreurs
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});