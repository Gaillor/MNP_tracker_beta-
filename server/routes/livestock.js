import express from 'express';
import { LivestockController } from '../controllers/livestock.controller.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Routes accessibles aux utilisateurs authentifiés
router.get('/', LivestockController.getLivestock);
router.get('/stats', LivestockController.getLivestockStats);
router.get('/:id', LivestockController.getLivestockById);
router.get('/:id/health-history', LivestockController.getHealthHistory);

// Routes nécessitant des permissions spécifiques
router.post('/', authorizeRole(['admin', 'user']), LivestockController.createLivestock);
router.put('/:id', authorizeRole(['admin', 'user']), LivestockController.updateLivestock);
router.delete('/:id', authorizeRole(['admin']), LivestockController.deleteLivestock);

export default router;