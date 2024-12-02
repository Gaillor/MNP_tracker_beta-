import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onClick?: (id: number) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getPriorityVariant = (priority: string): 'success' | 'warning' | 'danger' => {
    switch (priority) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'danger';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'À faire';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-200"
      onClick={() => onClick?.(task.id)}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
            <Badge variant={getStatusVariant(task.status)}>
              {getStatusLabel(task.status)}
            </Badge>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(task.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{new Date(task.endDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant={getPriorityVariant(task.priority)} className="capitalize">
              <AlertCircle className="h-3 w-3 mr-1" />
              {task.priority}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}