import express from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Routes accessibles aux utilisateurs authentifiés
router.get('/', TaskController.getTasks);
router.get('/stats', TaskController.getTaskStats);
router.get('/:id', TaskController.getTaskById);

// Routes nécessitant des permissions spécifiques
router.post('/', authorizeRole(['admin', 'user']), TaskController.createTask);
router.put('/:id', authorizeRole(['admin', 'user']), TaskController.updateTask);
router.delete('/:id', authorizeRole(['admin']), TaskController.deleteTask);

export default router;