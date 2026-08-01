import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/apiClient';
import type { ApiSuccess } from '../types/api';
import type { User } from '../types/user';
import type { UserFormValues } from '../schemas/userFormSchema';

function toRequestBody(values: UserFormValues) {
  return {
    firstName: values.firstName,
    middleName: values.middleName,
    lastName: values.lastName,
    email: values.email,
    phoneNumber: values.phoneNumber,
    address: values.address,
    adminNotes: values.adminNotes,
    // An empty date input means "not set" - omit it rather than send '', which would fail the
    // backend's date coercion.
    registered: values.registered || undefined,
  };
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: UserFormValues) =>
      apiRequest<ApiSuccess<User>>('/users', {
        method: 'POST',
        body: JSON.stringify(toRequestBody(values)),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: UserFormValues }) =>
      apiRequest<ApiSuccess<User>>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(toRequestBody(values)),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
