import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent } from '../../components/ui/Card';
import { Task, TASK_STATUS, TASK_PRIORITIES } from '../../types/task';
import { useTaskStore } from '../../store/tasks';
import { useInvestmentStore } from '../../store/investments';

type TaskFormData = Omit<Task, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>;

export function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const task = useTaskStore((state) =>
    id ? state.tasks.find((item) => item.id === parseInt(id)) : null
  );
  const investments = useInvestmentStore((state) => state.investments);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    defaultValues: task
      ? {
          ...task,
          startDate: new Date(task.startDate).toISOString().split('T')[0],
          endDate: new Date(task.endDate).toISOString().split('T')[0],
          assignedTo: task.assignedTo.toString(),
          investmentId: task.investmentId.toString(),
        }
      : undefined,
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      const formattedData = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        assignedTo: parseInt(data.assignedTo as unknown as string),
        investmentId: parseInt(data.investmentId as unknown as string),
      };

      if (id) {
        updateTask(parseInt(id), formattedData);
      } else {
        addTask(formattedData);
      }
      navigate('/tasks');
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
            onClick={() => navigate('/tasks')}
          >
            Retour
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">
            {id ? 'Modifier la tâche' : 'Nouvelle tâche'}
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

              <Select
                label="Investissement associé"
                options={investments.map((inv) => ({
                  value: inv.id.toString(),
                  label: inv.typeOfInvestment,
                }))}
                {...register('investmentId', {
                  required: "L'investissement est requis",
                })}
                error={errors.investmentId?.message}
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

              <Input
                type="date"
                label="Date de début"
                {...register('startDate', {
                  required: 'La date de début est requise',
                })}
                error={errors.startDate?.message}
              />

              <Input
                type="date"
                label="Date de fin"
                {...register('endDate', {
                  required: 'La date de fin est requise',
                })}
                error={errors.endDate?.message}
              />

              <Select
                label="Statut"
                options={TASK_STATUS}
                {...register('status', {
                  required: 'Le statut est requis',
                })}
                error={errors.status?.message}
              />

              <Select
                label="Priorité"
                options={TASK_PRIORITIES}
                {...register('priority', {
                  required: 'La priorité est requise',
                })}
                error={errors.priority?.message}
              />

              <Select
                label="Assigné à"
                options={[
                  { value: '1', label: 'Admin' }, // TODO: Remplacer par la liste des utilisateurs
                ]}
                {...register('assignedTo', {
                  required: "L'assignation est requise",
                })}
                error={errors.assignedTo?.message}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/tasks')}
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