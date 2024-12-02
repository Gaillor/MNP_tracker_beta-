import { NotificationService } from '../services/notification.service.js';

export class NotificationController {
  static async getNotifications(req, res, next) {
    try {
      const filters = {
        type: req.query.type,
        isRead: req.query.isRead === 'true',
        limit: parseInt(req.query.limit) || undefined
      };

      const notifications = await NotificationService.getNotifications(req.user.id, filters);
      const unreadCount = await NotificationService.getUnreadCount(req.user.id);

      res.json({
        notifications,
        unreadCount
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      await NotificationService.markAsRead(parseInt(req.params.id), req.user.id);
      const unreadCount = await NotificationService.getUnreadCount(req.user.id);
      res.json({ unreadCount });
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req, res, next) {
    try {
      await NotificationService.markAllAsRead(req.user.id);
      res.json({ unreadCount: 0 });
    } catch (error) {
      next(error);
    }
  }

  static async deleteNotification(req, res, next) {
    try {
      await NotificationService.deleteNotification(parseInt(req.params.id), req.user.id);
      const unreadCount = await NotificationService.getUnreadCount(req.user.id);
      res.json({ unreadCount });
    } catch (error) {
      next(error);
    }
  }
}