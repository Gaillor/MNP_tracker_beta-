import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent } from '../../components/ui/Card';
import { User, USER_ROLES, USER_PERMISSIONS } from '../../types/user';
import { useUsersStore } from '../../store/users';

type UserFormData = Omit<User, 'id' | 'lastLogin' | 'createdAt'>;

export function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const addUser = useUsersStore((state) => state.addUser);
  const updateUser = useUsersStore((state) => state.updateUser);
  const user = useUsersStore((state) =>
    id ? state.users.find((item) => item.id === parseInt(id)) : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    defaultValues: user || {
      isActive: true,
      permissions: [],
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      if (id) {
        updateUser(parseInt(id), data);
      } else {
        addUser(data);
      }
      navigate('/users');
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
            onClick={() => navigate('/users')}
          >
            Retour
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">
            {id ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                label="Nom d'utilisateur"
                {...register('username', {
                  required: 'Le nom d\'utilisateur est requis',
                })}
                error={errors.username?.message}
              />

              <Input
                type="email"
                label="Email"
                {...register('email', {
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email invalide',
                  },
                })}
                error={errors.email?.message}
              />

              <Select
                label="Rôle"
                options={USER_ROLES}
                {...register('role', {
                  required: 'Le rôle est requis',
                })}
                error={errors.role?.message}
              />

              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Permissions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {USER_PERMISSIONS.map((permission) => (
                    <label key={permission.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={permission.value}
                        {...register('permissions')}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/users')}
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