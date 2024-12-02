import express from 'express';
import { TimelineController } from '../controllers/timeline.controller.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Routes accessibles aux utilisateurs authentifiés
router.get('/', TimelineController.getEvents);
router.get('/stats', TimelineController.getTimelineStats);
router.get('/:id', TimelineController.getEventById);

// Routes nécessitant des permissions spécifiques
router.post('/', authorizeRole(['admin', 'user']), TimelineController.createEvent);
router.put('/:id', authorizeRole(['admin', 'user']), TimelineController.updateEvent);
router.delete('/:id', authorizeRole(['admin']), TimelineController.deleteEvent);

export default router;