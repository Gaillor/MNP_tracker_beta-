import React, { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DateRangePicker } from '../../components/reports/DateRangePicker';
import { useReportsStore } from '../../store/reports';
import { useInvestmentStore } from '../../store/investments';
import { REPORT_PERIODS } from '../../types/report';
import { formatCurrency } from '../../utils/format';
import { PerformanceChart } from '../../components/reports/PerformanceChart';
import { InvestmentDistributionChart } from '../../components/reports/InvestmentDistributionChart';

export function ReportsDashboard() {
  const [period, setPeriod] = useState('monthly');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { financialMetrics } = useReportsStore();
  const investments = useInvestmentStore((state) => state.investments);

  const categories = useMemo(() => {
    return Array.from(new Set(investments.map(inv => inv.category)));
  }, [investments]);

  // Fonction pour filtrer les données selon la période et les catégories
  const filterData = (item: { dateOfInvestment: Date | string; category: string }) => {
    const itemDate = new Date(item.dateOfInvestment);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const matchesDate = itemDate >= start && itemDate <= end;
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    
    return matchesDate && matchesCategory;
  };

  // Filtrer les investissements
  const filteredInvestments = useMemo(() => {
    return investments.filter(filterData);
  }, [investments, startDate, endDate, selectedCategories]);

  // Calculer les totaux filtrés
  const {
    totalInvestments,
    totalCurrentValue,
    totalProfitLoss,
    profitLossPercentage
  } = useMemo(() => {
    const totals = filteredInvestments.reduce(
      (acc, inv) => ({
        totalInvestments: acc.totalInvestments + inv.initialAmount,
        totalCurrentValue: acc.totalCurrentValue + inv.currentValue,
      }),
      { totalInvestments: 0, totalCurrentValue: 0 }
    );

    const profitLoss = totals.totalCurrentValue - totals.totalInvestments;
    const percentage = totals.totalInvestments > 0
      ? (profitLoss / totals.totalInvestments) * 100
      : 0;

    return {
      ...totals,
      totalProfitLoss: profitLoss,
      profitLossPercentage: percentage,
    };
  }, [filteredInvestments]);

  // Données pour le graphique de performance
  const performanceData = useMemo(() => {
    return filteredInvestments
      .sort((a, b) => new Date(a.dateOfInvestment).getTime() - new Date(b.dateOfInvestment).getTime())
      .map((inv) => ({
        date: new Date(inv.dateOfInvestment).toLocaleDateString(),
        value: inv.currentValue,
        initialValue: inv.initialAmount,
      }));
  }, [filteredInvestments]);

  // Données pour le graphique de distribution
  const distributionData = useMemo(() => {
    const groupedData = filteredInvestments.reduce((acc, inv) => {
      const existing = acc.find(item => item.name === inv.category);
      if (existing) {
        existing.value += inv.currentValue;
      } else {
        acc.push({ name: inv.category, value: inv.currentValue });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

    return groupedData.sort((a, b) => b.value - a.value);
  }, [filteredInvestments]);

  const handleExportData = () => {
    const data = filteredInvestments.map(inv => ({
      type: inv.typeOfInvestment,
      category: inv.category,
      initialAmount: inv.initialAmount,
      currentValue: inv.currentValue,
      profitLoss: inv.currentValue - inv.initialAmount,
      profitLossPercentage: ((inv.currentValue - inv.initialAmount) / inv.initialAmount) * 100,
      date: new Date(inv.dateOfInvestment).toLocaleDateString(),
    }));

    const csv = [
      ['Type', 'Catégorie', 'Montant initial', 'Valeur actuelle', 'Profit/Perte', '% Profit/Perte', 'Date'],
      ...data.map(row => Object.values(row)),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rapport-investissements-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <h2 className="text-2xl font-bold text-gray-900">Rapports financiers</h2>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <Select
            options={REPORT_PERIODS}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <Button
            variant="outline"
            icon={Download}
            onClick={handleExportData}
          >
            Exporter
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <Badge
            key={category}
            className={`cursor-pointer ${
              selectedCategories.includes(category)
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => {
              setSelectedCategories((prev) =>
                prev.includes(category)
                  ? prev.filter((c) => c !== category)
                  : [...prev, category]
              );
            }}
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-indigo-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-indigo-600" />
              </div>
              <Badge variant={totalProfitLoss >= 0 ? 'success' : 'danger'}>
                {totalProfitLoss >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(profitLossPercentage).toFixed(1)}%
              </Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">Total investi</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCurrency(totalInvestments)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">Valeur actuelle</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCurrency(totalCurrentValue)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-full ${
                totalProfitLoss >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <TrendingUp className={`h-6 w-6 ${
                  totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">Profit/Perte</h3>
              <p className={`mt-1 text-2xl font-semibold ${
                totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(totalProfitLoss)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">Nombre d'investissements</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {filteredInvestments.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart
          data={performanceData}
          title="Performance des investissements"
        />
        <InvestmentDistributionChart
          data={distributionData}
          title="Distribution par catégorie"
        />
      </div>
    </div>
  );
}