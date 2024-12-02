import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InvestmentCard } from '../../components/investments/InvestmentCard';
import { InvestmentFilters } from '../../components/investments/InvestmentFilters';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useInvestmentStore } from '../../store/investments';

export function InvestmentList() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const investments = useInvestmentStore((state) => state.investments);

  const filteredInvestments = investments.filter((investment) =>
    investment.typeOfInvestment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investment.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditInvestment = (id: number) => {
    navigate(`/investments/${id}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Investissements</h2>
        <Button
          icon={Plus}
          onClick={() => navigate('/investments/new')}
        >
          Nouvel investissement
        </Button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un investissement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          icon={Filter}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filtres
        </Button>
      </div>

      {showFilters && <InvestmentFilters />}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredInvestments.map((investment) => (
          <InvestmentCard
            key={investment.id}
            investment={investment}
            onClick={() => handleEditInvestment(investment.id)}
          />
        ))}
      </div>
    </div>
  );
}