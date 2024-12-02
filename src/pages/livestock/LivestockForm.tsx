import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent } from '../../components/ui/Card';
import { Livestock, LIVESTOCK_TYPES, LIVESTOCK_STATUS } from '../../types/livestock';
import { useLivestockStore } from '../../store/livestock';

type LivestockFormData = Omit<Livestock, 'id'>;

export function LivestockForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const addLivestock = useLivestockStore((state) => state.addLivestock);
  const updateLivestock = useLivestockStore((state) => state.updateLivestock);
  const livestock = useLivestockStore((state) => 
    id ? state.livestock.find(item => item.id === parseInt(id)) : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LivestockFormData>({
    defaultValues: livestock ? {
      ...livestock,
      dateOfBirth: new Date(livestock.dateOfBirth).toISOString().split('T')[0],
      acquisitionDate: new Date(livestock.acquisitionDate).toISOString().split('T')[0],
      acquisitionPrice: livestock.acquisitionPrice,
      investmentId: livestock.investmentId.toString(),
    } : {
      investmentId: '1', // TODO: Remplacer par la sélection d'investissement
    },
  });

  const onSubmit = async (data: LivestockFormData) => {
    try {
      const formattedData = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        acquisitionDate: new Date(data.acquisitionDate),
        acquisitionPrice: parseFloat(data.acquisitionPrice as unknown as string),
        investmentId: parseInt(data.investmentId as unknown as string),
      };

      if (id) {
        updateLivestock(parseInt(id), formattedData);
      } else {
        addLivestock(formattedData);
      }
      navigate('/livestock');
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
            onClick={() => navigate('/livestock')}
          >
            Retour
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">
            {id ? 'Modifier un animal' : 'Ajouter un animal'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Identifiant unique"
                {...register('uniqueIdentifier', {
                  required: 'L\'identifiant est requis',
                })}
                error={errors.uniqueIdentifier?.message}
              />

              <Select
                label="Type d'animal"
                options={LIVESTOCK_TYPES}
                {...register('type', {
                  required: 'Le type est requis',
                })}
                error={errors.type?.message}
              />

              <Input
                label="Race"
                {...register('race', {
                  required: 'La race est requise',
                })}
                error={errors.race?.message}
              />

              <Input
                type="date"
                label="Date de naissance"
                {...register('dateOfBirth', {
                  required: 'La date de naissance est requise',
                })}
                error={errors.dateOfBirth?.message}
              />

              <Select
                label="Genre"
                options={[
                  { value: 'male', label: 'Mâle' },
                  { value: 'female', label: 'Femelle' },
                ]}
                {...register('gender', {
                  required: 'Le genre est requis',
                })}
                error={errors.gender?.message}
              />

              <Input
                type="date"
                label="Date d'acquisition"
                {...register('acquisitionDate', {
                  required: 'La date d\'acquisition est requise',
                })}
                error={errors.acquisitionDate?.message}
              />

              <Input
                type="number"
                label="Prix d'acquisition (MGA)"
                {...register('acquisitionPrice', {
                  required: 'Le prix est requis',
                  min: { value: 0, message: 'Le prix doit être positif' },
                })}
                error={errors.acquisitionPrice?.message}
              />

              <Select
                label="Statut"
                options={LIVESTOCK_STATUS}
                {...register('currentStatus', {
                  required: 'Le statut est requis',
                })}
                error={errors.currentStatus?.message}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/livestock')}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            icon={Save}
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
}