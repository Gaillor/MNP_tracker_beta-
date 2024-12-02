import { TimelineEventType } from './timeline';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: TimelineEventType;
  isRead: boolean;
  createdAt: Date;
  link?: string;
}

export const NOTIFICATION_TYPES = {
  investment: {
    icon: 'TrendingUp',
    color: 'text-blue-600 bg-blue-100',
  },
  livestock: {
    icon: 'Users',
    color: 'text-green-600 bg-green-100',
  },
  task: {
    icon: 'Calendar',
    color: 'text-purple-600 bg-purple-100',
  },
  financial: {
    icon: 'DollarSign',
    color: 'text-yellow-600 bg-yellow-100',
  },
  general: {
    icon: 'Bell',
    color: 'text-gray-600 bg-gray-100',
  },
};