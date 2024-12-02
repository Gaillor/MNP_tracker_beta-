import React from 'react';
import { TrendingUp, Users, Calendar } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Investissements"
          value="12"
          description="Projets actifs"
          icon={TrendingUp}
          trend="+2.5%"
        />
        <DashboardCard
          title="Élevage"
          value="145"
          description="Têtes de bétail"
          icon={Users}
          trend="+5"
        />
        <DashboardCard
          title="Tâches"
          value="8"
          description="Tâches en cours"
          icon={Calendar}
          trend="4 urgent"
        />
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  trend: string;
}

function DashboardCard({ title, value, description, icon: Icon, trend }: DashboardCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  {trend}
                </div>
              </dd>
              <dd className="text-sm text-gray-500">{description}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}