import { TimelineService } from '../services/timeline.service.js';
import { validateTimelineEventInput, validateTimelineEventUpdateInput } from '../validators/timeline.validator.js';

export class TimelineController {
  static async getEvents(req, res, next) {
    try {
      const filters = {
        type: req.query.type,
        category: req.query.category,
        visibilityLevel: req.query.visibilityLevel,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        userId: req.query.userId || req.user.id
      };

      const events = await TimelineService.getEvents(filters);
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  static async getEventById(req, res, next) {
    try {
      const event = await TimelineService.getEventById(parseInt(req.params.id));
      if (!event) {
        return res.status(404).json({ message: 'Événement non trouvé' });
      }
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  static async createEvent(req, res, next) {
    try {
      const { error } = validateTimelineEventInput(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const event = await TimelineService.createEvent({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }

  static async updateEvent(req, res, next) {
    try {
      const { error } = validateTimelineEventUpdateInput(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const event = await TimelineService.updateEvent(
        parseInt(req.params.id),
        req.body
      );
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  static async deleteEvent(req, res, next) {
    try {
      await TimelineService.deleteEvent(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getTimelineStats(req, res, next) {
    try {
      const stats = await TimelineService.getTimelineStats(req.user.id);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}