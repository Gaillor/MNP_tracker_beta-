import { InvestmentService } from '../services/investment.service.js';
import { validateInvestmentInput, validateInvestmentUpdateInput } from '../validators/investment.validator.js';

export class InvestmentController {
  static async getInvestments(req, res, next) {
    try {
      const filters = {
        category: req.query.category,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const investments = await InvestmentService.getInvestments(req.user.id, filters);
      res.json(investments);
    } catch (error) {
      next(error);
    }
  }

  static async getInvestmentById(req, res, next) {
    try {
      const investment = await InvestmentService.getInvestmentById(parseInt(req.params.id));
      if (!investment) {
        return res.status(404).json({ message: 'Investissement non trouvé' });
      }
      res.json(investment);
    } catch (error) {
      next(error);
    }
  }

  static async createInvestment(req, res, next) {
    try {
      const { error } = validateInvestmentInput(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const investment = await InvestmentService.createInvestment({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(investment);
    } catch (error) {
      next(error);
    }
  }

  static async updateInvestment(req, res, next) {
    try {
      const { error } = validateInvestmentUpdateInput(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const investment = await InvestmentService.updateInvestment(
        parseInt(req.params.id),
        req.body
      );
      res.json(investment);
    } catch (error) {
      next(error);
    }
  }

  static async deleteInvestment(req, res, next) {
    try {
      await InvestmentService.deleteInvestment(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getInvestmentStats(req, res, next) {
    try {
      const stats = await InvestmentService.getInvestmentStats(req.user.id);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  static async getInvestmentPerformance(req, res, next) {
    try {
      const { id } = req.params;
      const { period } = req.query;
      const performance = await InvestmentService.getInvestmentPerformance(
        parseInt(id),
        period
      );
      res.json(performance);
    } catch (error) {
      next(error);
    }
  }
}