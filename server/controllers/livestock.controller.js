import { LivestockService } from '../services/livestock.service.js';
import { validateLivestockInput, validateLivestockUpdateInput } from '../validators/livestock.validator.js';

export class LivestockController {
  static async getLivestock(req, res, next) {
    try {
      const filters = {
        type: req.query.type,
        status: req.query.status,
        investmentId: req.query.investmentId
      };

      const livestock = await LivestockService.getLivestock(filters);
      res.json(livestock);
    } catch (error) {
      next(error);
    }
  }

  static async getLivestockById(req, res, next) {
    try {
      const livestock = await LivestockService.getLivestockById(parseInt(req.params.id));
      if (!livestock) {
        return res.status(404).json({ message: 'Animal non trouvé' });
      }
      res.json(livestock);
    } catch (error) {
      next(error);
    }
  }

  static async createLivestock(req, res, next) {
    try {
      const { error } = validateLivestockInput(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const livestock = await LivestockService.createLivestock(req.body);
      res.status(201).json(livestock);
    } catch (error) {
      next(error);
    }
  }

  static async updateLivestock(req, res, next) {
    try {
      const { error } = validateLivestockUpdateInput(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const livestock = await LivestockService.updateLivestock(
        parseInt(req.params.id),
        req.body
      );
      res.json(livestock);
    } catch (error) {
      next(error);
    }
  }

  static async deleteLivestock(req, res, next) {
    try {
      await LivestockService.deleteLivestock(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getLivestockStats(req, res, next) {
    try {
      const stats = await LivestockService.getLivestockStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  static async getHealthHistory(req, res, next) {
    try {
      const history = await LivestockService.getHealthHistory(parseInt(req.params.id));
      res.json(history);
    } catch (error) {
      next(error);
    }
  }
}