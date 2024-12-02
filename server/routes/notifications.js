import express from 'express';
import { NotificationController } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', NotificationController.getNotifications);
router.patch('/:id/read', NotificationController.markAsRead);
router.post('/mark-all-read', NotificationController.markAllAsRead);
router.delete('/:id', NotificationController.deleteNotification);

export default router;