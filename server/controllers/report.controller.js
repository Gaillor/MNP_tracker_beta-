import { ReportService } from '../services/report.service.js';

export class ReportController {
  static async getFinancialReport(req, res, next) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        userId: req.user.id
      };

      const report = await ReportService.getFinancialReport(filters);
      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  static async getLivestockReport(req, res, next) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const report = await ReportService.getLivestockReport(filters);
      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  static async getTaskReport(req, res, next) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        userId: req.user.id
      };

      const report = await ReportService.getTaskReport(filters);
      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  static async getCompleteReport(req, res, next) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const report = await ReportService.generateCompleteReport(req.user.id, filters);
      res.json(report);
    } catch (error) {
      next(error);
    }
  }
}