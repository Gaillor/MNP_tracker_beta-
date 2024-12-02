import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent } from '../ui/Card';
import { formatCurrency } from '../../utils/format';

interface PerformanceData {
  date: string;
  value: number;
  initialValue: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  title: string;
}

export function PerformanceChart({ data, title }: PerformanceChartProps) {
  return (
    <Card>
      <CardContent>
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Valeur actuelle"
                stroke="#4F46E5"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="initialValue"
                name="Valeur initiale"
                stroke="#9CA3AF"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}