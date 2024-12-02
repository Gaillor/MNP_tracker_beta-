import React from 'react';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { User as UserType } from '../../types/user';

interface UserCardProps {
  user: UserType;
  onEdit: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export function UserCard({ user, onEdit, onToggleStatus }: UserCardProps) {
  const getRoleBadgeVariant = (role: string): 'success' | 'warning' | 'info' => {
    switch (role) {
      case 'admin':
        return 'success';
      case 'user':
        return 'info';
      default:
        return 'warning';
    }
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'user':
        return 'Utilisateur';
      case 'readonly':
        return 'Lecture seule';
      default:
        return role;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{user.username}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-4 w-4 mr-1" />
                  {user.email}
                </div>
              </div>
            </div>
            <Badge variant={getRoleBadgeVariant(user.role)}>
              {getRoleLabel(user.role)}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Dernière connexion: {new Date(user.lastLogin).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              {user.permissions.length} permissions
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(user.id)}
            >
              Modifier
            </Button>
            <Button
              variant={user.isActive ? 'danger' : 'success'}
              size="sm"
              onClick={() => onToggleStatus(user.id)}
            >
              {user.isActive ? 'Désactiver' : 'Activer'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}