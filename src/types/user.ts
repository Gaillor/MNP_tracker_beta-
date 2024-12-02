export type UserRole = 'admin' | 'user' | 'readonly';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  lastLogin: Date;
  createdAt: Date;
  isActive: boolean;
  permissions: string[];
}

export const USER_ROLES = [
  { value: 'admin', label: 'Administrateur' },
  { value: 'user', label: 'Utilisateur standard' },
  { value: 'readonly', label: 'Lecture seule' },
];

export const USER_PERMISSIONS = [
  { value: 'manage_users', label: 'Gérer les utilisateurs' },
  { value: 'manage_investments', label: 'Gérer les investissements' },
  { value: 'manage_livestock', label: 'Gérer le bétail' },
  { value: 'manage_tasks', label: 'Gérer les tâches' },
  { value: 'view_reports', label: 'Voir les rapports' },
  { value: 'manage_settings', label: 'Gérer les paramètres' },
];