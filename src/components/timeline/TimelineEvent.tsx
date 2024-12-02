import React from 'react';
import { Calendar, Tag, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { TimelineEvent as ITimelineEvent } from '../../types/timeline';

interface TimelineEventProps {
  event: ITimelineEvent;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function TimelineEvent({ event, onEdit, onDelete }: TimelineEventProps) {
  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case 'investment':
        return 'bg-blue-100 text-blue-800';
      case 'livestock':
        return 'bg-green-100 text-green-800';
      case 'task':
        return 'bg-purple-100 text-purple-800';
      case 'financial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeLabel = (type: string): string => {
    switch (type) {
      case 'investment':
        return 'Investissement';
      case 'livestock':
        return 'Bétail';
      case 'task':
        return 'Tâche';
      case 'financial':
        return 'Financier';
      default:
        return 'Général';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
              <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{new Date(event.eventDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getEventTypeColor(event.type)}>
                {getEventTypeLabel(event.type)}
              </Badge>
              <Badge variant="info">
                <Eye className="h-3 w-3 mr-1" />
                {event.visibilityLevel}
              </Badge>
            </div>
          </div>

          <p className="text-gray-600">{event.description}</p>

          {event.mediaUrls && event.mediaUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {event.mediaUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Media ${index + 1}`}
                  className="rounded-lg object-cover h-32 w-full"
                />
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                icon={Edit}
                onClick={() => onEdit(event.id)}
              >
                Modifier
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => onDelete(event.id)}
              >
                Supprimer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}