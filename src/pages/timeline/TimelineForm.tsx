import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent } from '../../components/ui/Card';
import { TimelineEvent, EVENT_TYPES, EVENT_CATEGORIES, VISIBILITY_LEVELS } from '../../types/timeline';
import { useTimelineStore } from '../../store/timeline';
import { useInvestmentStore } from '../../store/investments';
import { useLivestockStore } from '../../store/livestock';

type TimelineFormData = Omit<TimelineEvent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export function TimelineForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const addEvent = useTimelineStore((state) => state.addEvent);
  const updateEvent = useTimelineStore((state) => state.updateEvent);
  const event = useTimelineStore((state) =>
    id ? state.events.find((item) => item.id === parseInt(id)) : null
  );

  const investments = useInvestmentStore((state) => state.investments);
  const livestock = useLivestockStore((state) => state.livestock);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TimelineFormData>({
    defaultValues: event
      ? {
          ...event,
          eventDate: new Date(event.eventDate).toISOString().split('T')[0],
          investmentId: event.investmentId?.toString(),
          livestockId: event.livestockId?.toString(),
          locationId: event.locationId?.toString(),
        }
      : {
          visibilityLevel: 'public',
          type: 'general',
          category: 'other',
        },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: TimelineFormData) => {
    try {
      const formattedData = {
        ...data,
        eventDate: new Date(data.eventDate),
        investmentId: data.investmentId ? parseInt(data.investmentId) : undefined,
        livestockId: data.livestockId ? parseInt(data.livestockId) : undefined,
        locationId: data.locationId ? parseInt(data.locationId) : undefined,
        userId: 1, // TODO: Get from auth context
      };

      if (id) {
        updateEvent(parseInt(id), formattedData);
      } else {
        addEvent(formattedData);
      }
      navigate('/timeline');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate('/timeline')}
          >
            Retour
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">
            {id ? 'Modifier l\'événement' : 'Nouvel événement'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                label="Titre"
                {...register('title', {
                  required: 'Le titre est requis',
                })}
                error={errors.title?.message}
              />

              <Input
                type="date"
                label="Date de l'événement"
                {...register('eventDate', {
                  required: 'La date est requise',
                })}
                error={errors.eventDate?.message}
              />

              <Select
                label="Type"
                options={EVENT_TYPES}
                {...register('type', {
                  required: 'Le type est requis',
                })}
                error={errors.type?.message}
              />

              <Select
                label="Catégorie"
                options={EVENT_CATEGORIES}
                {...register('category', {
                  required: 'La catégorie est requise',
                })}
                error={errors.category?.message}
              />

              {selectedType === 'investment' && (
                <Select
                  label="Investissement associé"
                  options={investments.map((inv) => ({
                    value: inv.id.toString(),
                    label: inv.typeOfInvestment,
                  }))}
                  {...register('investmentId')}
                  error={errors.investmentId?.message}
                />
              )}

              {selectedType === 'livestock' && (
                <Select
                  label="Bétail associé"
                  options={livestock.map((animal) => ({
                    value: animal.id.toString(),
                    label: `${animal.uniqueIdentifier} - ${animal.type}`,
                  }))}
                  {...register('livestockId')}
                  error={errors.livestockId?.message}
                />
              )}

              <Select
                label="Visibilité"
                options={VISIBILITY_LEVELS}
                {...register('visibilityLevel', {
                  required: 'La visibilité est requise',
                })}
                error={errors.visibilityLevel?.message}
              />

              <div className="md:col-span-2">
                <Input
                  label="Description"
                  {...register('description', {
                    required: 'La description est requise',
                  })}
                  error={errors.description?.message}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/timeline')}
          >
            Annuler
          </Button>
          <Button type="submit" icon={Save} isLoading={isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
}