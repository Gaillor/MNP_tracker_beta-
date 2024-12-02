import React from 'react';
import { Calendar, Tag, CreditCard, Activity } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Livestock } from '../../types/livestock';
import { formatCurrency } from '../../utils/format';

interface LivestockCardProps {
  livestock: Livestock;
  onClick: (id: number) => void;
}

export function LivestockCard({ livestock, onClick }: LivestockCardProps) {
  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'sick':
        return 'warning';
      case 'deceased':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'healthy':
        return 'En bonne santé';
      case 'sick':
        return 'Malade';
      case 'sold':
        return 'Vendu';
      case 'deceased':
        return 'Décédé';
      default:
        return status;
    }
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => onClick(livestock.id)}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-gray-400" />
            <span className="font-medium">{livestock.uniqueIdentifier}</span>
          </div>
          <Badge variant={getStatusVariant(livestock.currentStatus)}>
            {getStatusLabel(livestock.currentStatus)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{livestock.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Race</p>
              <p className="font-medium">{livestock.race}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              Né(e) le {new Date(livestock.dateOfBirth).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CreditCard className="h-4 w-4" />
            <span>Prix d'acquisition: {formatCurrency(livestock.acquisitionPrice)}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Activity className="h-4 w-4" />
            <span>Genre: {livestock.gender === 'male' ? 'Mâle' : 'Femelle'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}