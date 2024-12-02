import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent } from '../../components/ui/Card';
import { Investment } from '../../types';
import { useInvestmentStore } from '../../store/investments';

type InvestmentFormData = Omit<Investment, 'id' | 'userId'>;

const INVESTMENT_CATEGORIES = [
  { value: 'Élevage', label: 'Élevage' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'Infrastructure', label: 'Infrastructure' },
];

const INVESTMENT_STATUS = [
  { value: 'actif', label: 'Actif' },
  { value: 'termine', label: 'Terminé' },
  { value: 'suspendu', label: 'Suspendu' },
];

export function InvestmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const addInvestment = useInvestmentStore((state) => state.addInvestment);
  const updateInvestment = useInvestmentStore((state) => state.updateInvestment);
  const investment = useInvestmentStore((state) =>
    id ? state.investments.find((item) => item.id === parseInt(id)) : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvestmentFormData>({
    defaultValues: investment
      ? {
          ...investment,
          dateOfInvestment: new Date(investment.dateOfInvestment)
            .toISOString()
            .split('T')[0],
          locationId: investment.locationId.toString(),
          initialAmount: investment.initialAmount,
          currentValue: investment.currentValue,
        }
      : undefined,
  });

  const onSubmit = async (data: InvestmentFormData) => {
    try {
      const formattedData = {
        ...data,
        dateOfInvestment: new Date(data.dateOfInvestment),
        locationId: parseInt(data.locationId as unknown as string),
        initialAmount: parseFloat(data.initialAmount as unknown as string),
        currentValue: parseFloat(data.currentValue as unknown as string),
      };

      if (id) {
        updateInvestment(parseInt(id), formattedData);
      } else {
        addInvestment(formattedData);
      }
      navigate('/investments');
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
            onClick={() => navigate('/investments')}
          >
            Retour
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">
            {id ? 'Modifier l\'investissement' : 'Nouvel investissement'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Select
                label="Catégorie"
                options={INVESTMENT_CATEGORIES}
                {...register('category', { required: 'La catégorie est requise' })}
                error={errors.category?.message}
              />

              <Input
                label="Type d'investissement"
                {...register('typeOfInvestment', {
                  required: 'Le type est requis',
                })}
                error={errors.typeOfInvestment?.message}
              />

              <Input
                type="number"
                label="Montant initial (MGA)"
                {...register('initialAmount', {
                  required: 'Le montant initial est requis',
                  min: { value: 0, message: 'Le montant doit être positif' },
                })}
                error={errors.initialAmount?.message}
              />

              <Input
                type="number"
                label="Valeur actuelle (MGA)"
                {...register('currentValue', {
                  required: 'La valeur actuelle est requise',
                  min: { value: 0, message: 'La valeur doit être positive' },
                })}
                error={errors.currentValue?.message}
              />

              <Input
                type="date"
                label="Date d'investissement"
                {...register('dateOfInvestment', {
                  required: 'La date est requise',
                })}
                error={errors.dateOfInvestment?.message}
              />

              <Select
                label="Lieu"
                options={[
                  { value: '1', label: 'Site A' },
                  { value: '2', label: 'Site B' },
                ]}
                {...register('locationId', { required: 'Le lieu est requis' })}
                error={errors.locationId?.message}
              />

              <Select
                label="Statut"
                options={INVESTMENT_STATUS}
                {...register('status', { required: 'Le statut est requis' })}
                error={errors.status?.message}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/investments')}
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