import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, ApiError } from '../lib/apiClient';
import type { ApiSuccess } from '../types/api';
import type { User } from '../types/user';
import type { UserFormValues } from '../schemas/userFormSchema';
import { useUIStore } from '../store/useUIStore';

const HIGHLIGHT_DURATION_MS = 1500;

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
  const setHighlightedUserId = useUIStore(state => state.setHighlightedUserId);

  return useMutation({
    mutationFn: (values: UserFormValues) =>
      apiRequest<ApiSuccess<User>>('/users', {
        method: 'POST',
        body: JSON.stringify(toRequestBody(values)),
      }),
    onSuccess: result => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setHighlightedUserId(result.data.id);
      setTimeout(() => setHighlightedUserId(null), HIGHLIGHT_DURATION_MS);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const setHighlightedUserId = useUIStore(state => state.setHighlightedUserId);

  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: UserFormValues }) =>
      apiRequest<ApiSuccess<User>>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(toRequestBody(values)),
      }),
    onSuccess: result => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setHighlightedUserId(result.data.id);
      setTimeout(() => setHighlightedUserId(null), HIGHLIGHT_DURATION_MS);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiRequest<ApiSuccess<{ id: number }>>(`/users/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: err => {
      // A 404 means the row is already gone server-side, so our cache is stale regardless of
      // this attempt's own outcome - refetch so the list reflects reality.
      if (err instanceof ApiError && err.status === 404) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      }
    },
  });
}
