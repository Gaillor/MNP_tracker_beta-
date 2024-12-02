import express from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Routes nécessitant des permissions spécifiques
router.get('/financial', authorizeRole(['admin', 'user']), ReportController.getFinancialReport);
router.get('/livestock', authorizeRole(['admin', 'user']), ReportController.getLivestockReport);
router.get('/tasks', authorizeRole(['admin', 'user']), ReportController.getTaskReport);
router.get('/complete', authorizeRole(['admin']), ReportController.getCompleteReport);

export default router;