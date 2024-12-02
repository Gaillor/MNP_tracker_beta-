import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TimelineEvent } from '../../components/timeline/TimelineEvent';
import { useTimelineStore } from '../../store/timeline';
import { EVENT_TYPES, EVENT_CATEGORIES, VISIBILITY_LEVELS } from '../../types/timeline';

export function TimelineList() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('');

  const events = useTimelineStore((state) => state.events);
  const deleteEvent = useTimelineStore((state) => state.deleteEvent);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || event.type === typeFilter;
    const matchesCategory = !categoryFilter || event.category === categoryFilter;
    const matchesVisibility = !visibilityFilter || event.visibilityLevel === visibilityFilter;
    return matchesSearch && matchesType && matchesCategory && matchesVisibility;
  });

  const handleEditEvent = (id: number) => {
    navigate(`/timeline/${id}/edit`);
  };

  const handleDeleteEvent = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      deleteEvent(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Fil d'actualité</h2>
        <Button
          icon={Plus}
          onClick={() => navigate('/timeline/new')}
        >
          Nouvel événement
        </Button>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un événement..."
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: '', label: 'Tous les types' },
              ...EVENT_TYPES,
            ]}
          />
          <Select
            label="Catégorie"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: '', label: 'Toutes les catégories' },
              ...EVENT_CATEGORIES,
            ]}
          />
          <Select
            label="Visibilité"
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            options={[
              { value: '', label: 'Toutes les visibilités' },
              ...VISIBILITY_LEVELS,
            ]}
          />
        </div>
      )}

      <div className="space-y-6">
        {filteredEvents.map((event) => (
          <TimelineEvent
            key={event.id}
            event={event}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        ))}
      </div>
    </div>
  );
}