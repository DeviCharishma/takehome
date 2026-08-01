import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import Modal from './Modal';
import { ApiError } from '../lib/apiClient';
import { useCreateUser, useUpdateUser } from '../hooks/useUserMutations';
import { userFormSchema, emptyUserFormValues, userToFormValues } from '../schemas/userFormSchema';
import type { UserFormValues } from '../schemas/userFormSchema';
import type { User } from '../types/user';

interface UserFormModalContentProps {
  mode: 'add' | 'edit';
  user: User | null;
  onClose: () => void;
}

const inputClass =
  'w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 disabled:bg-neutral-100 disabled:text-neutral-400';

interface FieldProps {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

function Field({ label, error, className, children }: FieldProps) {
  return (
    <label className={clsx('block text-sm', className)}>
      <span className="mb-1 block font-medium text-neutral-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export default function UserFormModalContent({ mode, user, onClose }: UserFormModalContentProps) {
  const titleId = useId();
  const [isSuccess, setIsSuccess] = useState(false);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const isSubmitting = createUser.isPending || updateUser.isPending;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user ? userToFormValues(user) : emptyUserFormValues,
  });

  const onSubmit = handleSubmit(async values => {
    try {
      if (mode === 'edit' && user) {
        await updateUser.mutateAsync({ id: user.id, values });
      } else {
        await createUser.mutateAsync(values);
      }

      setIsSuccess(true);
      setTimeout(onClose, 900);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, messages]) => {
          if (field in emptyUserFormValues) {
            setError(field as keyof UserFormValues, { type: 'server', message: messages[0] });
          }
        });
      } else {
        setError('root', {
          message: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
        });
      }
    }
  });

  return (
    <Modal
      onClose={onClose}
      closeOnEscape={!isSubmitting}
      closeOnBackdropClick={!isSubmitting}
      titleId={titleId}
    >
      <h2 id={titleId} className="text-lg font-semibold text-neutral-900">
        {mode === 'edit' ? 'Edit User' : 'Add User'}
      </h2>

      {isSuccess ? (
        <p className="mt-6 text-sm text-green-700">
          ✓ User {mode === 'edit' ? 'updated' : 'created'} successfully.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
          {errors.root?.message && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errors.root.message}</p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="First Name" error={errors.firstName?.message}>
              <input {...register('firstName')} disabled={isSubmitting} className={inputClass} />
            </Field>

            <Field label="Middle Name" error={errors.middleName?.message}>
              <input {...register('middleName')} disabled={isSubmitting} className={inputClass} />
            </Field>

            <Field label="Last Name" error={errors.lastName?.message}>
              <input {...register('lastName')} disabled={isSubmitting} className={inputClass} />
            </Field>

            <Field label="Email" error={errors.email?.message}>
              <input type="email" {...register('email')} disabled={isSubmitting} className={inputClass} />
            </Field>

            <Field label="Phone Number" error={errors.phoneNumber?.message}>
              <input type="tel" {...register('phoneNumber')} disabled={isSubmitting} className={inputClass} />
            </Field>

            <Field label="Registered" error={errors.registered?.message}>
              <input type="date" {...register('registered')} disabled={isSubmitting} className={inputClass} />
            </Field>
          </div>

          <Field label="Address" error={errors.address?.message}>
            <input {...register('address')} disabled={isSubmitting} className={inputClass} />
          </Field>

          <Field label="Admin Notes" error={errors.adminNotes?.message}>
            <textarea {...register('adminNotes')} disabled={isSubmitting} rows={3} className={inputClass} />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
