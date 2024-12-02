import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', AuthController.login);
router.get('/validate', AuthController.validateToken);

export default router;