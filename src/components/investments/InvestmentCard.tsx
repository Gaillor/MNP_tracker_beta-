import React from 'react';
import { TrendingUp, MapPin } from 'lucide-react';
import { Investment } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Card, CardContent } from '../ui/Card';

interface InvestmentCardProps {
  investment: Investment;
  onClick?: () => void;
}

export function InvestmentCard({ investment, onClick }: InvestmentCardProps) {
  const profitPercentage = ((investment.currentValue - investment.initialAmount) / investment.initialAmount) * 100;
  const isProfit = profitPercentage >= 0;

  return (
    <Card 
      className="cursor-pointer transition-shadow duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TrendingUp className={`h-8 w-8 ${isProfit ? 'text-green-500' : 'text-red-500'}`} />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">{investment.typeOfInvestment}</h3>
              <p className="text-sm text-gray-500">{investment.category}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            investment.status === 'actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {investment.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Investissement initial</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              {formatCurrency(investment.initialAmount)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Valeur actuelle</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              {formatCurrency(investment.currentValue)}
            </dd>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Performance</span>
            <span className={`text-sm font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {isProfit ? '+' : ''}{profitPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(Math.abs(profitPercentage), 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          Location ID: {investment.locationId}
        </div>
      </CardContent>
    </Card>
  );
}