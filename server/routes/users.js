import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Routes protégées nécessitant le rôle admin
router.get('/', authorizeRole(['admin']), UserController.getUsers);
router.get('/:id', authorizeRole(['admin']), UserController.getUserById);
router.post('/', authorizeRole(['admin']), UserController.createUser);
router.put('/:id', authorizeRole(['admin']), UserController.updateUser);
router.delete('/:id', authorizeRole(['admin']), UserController.deleteUser);
router.patch('/:id/toggle-status', authorizeRole(['admin']), UserController.toggleUserStatus);

export default router;