import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Trash2, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useNotificationStore } from '../../store/notifications';
import { NOTIFICATION_TYPES } from '../../types/notification';

interface NotificationListProps {
  onClose?: () => void;
}

export function NotificationList({ onClose }: NotificationListProps) {
  const navigate = useNavigate();
  const { notifications, isLoading, error, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      onClose?.();
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Chargement des notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Bell className="h-8 w-8 mx-auto mb-2" />
        <p>Aucune notification</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      <div className="p-4 bg-gray-50 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAllAsRead()}
        >
          <Check className="h-4 w-4 mr-1" />
          Tout marquer comme lu
        </Button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              !notification.isRead ? 'bg-blue-50' : ''
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${NOTIFICATION_TYPES[notification.type].color}`}>
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-500">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}