import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  BarChart2,
  Clock,
  UserPlus
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: Home },
  { name: 'Investissements', href: '/investments', icon: TrendingUp },
  { name: 'Élevage', href: '/livestock', icon: Users },
  { name: 'Tâches', href: '/tasks', icon: Calendar },
  { name: "Fil d'actualité", href: '/timeline', icon: Clock },
  { name: 'Utilisateurs', href: '/users', icon: UserPlus },
  { name: 'Rapports', href: '/reports', icon: BarChart2 },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon
                    className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}