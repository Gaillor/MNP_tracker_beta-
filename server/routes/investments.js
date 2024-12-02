import express from 'express';
import { InvestmentController } from '../controllers/investment.controller.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Routes accessibles aux utilisateurs authentifiés
router.get('/', InvestmentController.getInvestments);
router.get('/stats', InvestmentController.getInvestmentStats);
router.get('/:id', InvestmentController.getInvestmentById);
router.get('/:id/performance', InvestmentController.getInvestmentPerformance);

// Routes nécessitant des permissions spécifiques
router.post('/', authorizeRole(['admin', 'user']), InvestmentController.createInvestment);
router.put('/:id', authorizeRole(['admin', 'user']), InvestmentController.updateInvestment);
router.delete('/:id', authorizeRole(['admin']), InvestmentController.deleteInvestment);

export default router;