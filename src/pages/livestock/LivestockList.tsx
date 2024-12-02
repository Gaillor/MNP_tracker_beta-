import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LivestockCard } from '../../components/livestock/LivestockCard';
import { useLivestockStore } from '../../store/livestock';
import { LIVESTOCK_TYPES, LIVESTOCK_STATUS } from '../../types/livestock';

export function LivestockList() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const livestock = useLivestockStore((state) => state.livestock);

  const filteredLivestock = livestock.filter((animal) => {
    const matchesSearch = animal.uniqueIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.race.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || animal.type === typeFilter;
    const matchesStatus = !statusFilter || animal.currentStatus === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEditLivestock = (id: number) => {
    navigate(`/livestock/${id}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion du Bétail</h2>
        <Button 
          icon={Plus}
          onClick={() => navigate('/livestock/new')}
        >
          Ajouter un animal
        </Button>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher par identifiant ou race..."
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

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Type d'animal"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: '', label: 'Tous les types' },
              ...LIVESTOCK_TYPES,
            ]}
          />
          <Select
            label="Statut"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Tous les statuts' },
              ...LIVESTOCK_STATUS,
            ]}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLivestock.map((animal) => (
          <LivestockCard
            key={animal.id}
            livestock={animal}
            onClick={handleEditLivestock}
          />
        ))}
      </div>
    </div>
  );
}