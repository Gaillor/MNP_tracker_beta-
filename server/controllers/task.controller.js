import { TaskService } from '../services/task.service.js';
import { validateTaskInput, validateTaskUpdateInput } from '../validators/task.validator.js';

export class TaskController {
  static async getTasks(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        assignedTo: req.query.assignedTo,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const tasks = await TaskService.getTasks(filters);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req, res, next) {
    try {
      const task = await TaskService.getTaskById(parseInt(req.params.id));
      if (!task) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  static async createTask(req, res, next) {
    try {
      const { error } = validateTaskInput(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const task = await TaskService.createTask({
        ...req.body,
        createdBy: req.user.id
      });
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req, res, next) {
    try {
      const { error } = validateTaskUpdateInput(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const task = await TaskService.updateTask(
        parseInt(req.params.id),
        req.body
      );
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req, res, next) {
    try {
      await TaskService.deleteTask(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getTaskStats(req, res, next) {
    try {
      const stats = await TaskService.getTaskStats(req.user.id);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}