import { useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import Modal from './Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
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

interface FieldProps {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

function Field({ label, error, className, children }: FieldProps) {
  return (
    <label className={clsx('block text-sm', className)}>
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export default function UserFormModalContent({ mode, user, onClose }: UserFormModalContentProps) {
  const titleId = useId();
  const [isSuccess, setIsSuccess] = useState(false);
  // `isSubmitting` (below) is only current as of the last render, so a second click fired
  // before React re-renders with `disabled` in the DOM wouldn't see it in time. This ref is
  // checked and set synchronously, so it catches a same-tick double-click that the disabled
  // attribute alone might miss.
  const isSubmittingRef = useRef(false);

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
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

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
    } finally {
      isSubmittingRef.current = false;
    }
  });

  return (
    <Modal onClose={onClose} closeOnEscape={!isSubmitting} closeOnBackdropClick={!isSubmitting} titleId={titleId}>
      <h2 id={titleId} className="text-lg font-semibold tracking-tight text-slate-900">
        {mode === 'edit' ? 'Edit User' : 'Add User'}
      </h2>

      {isSuccess ? (
        <div className="mt-6 flex animate-check-in items-center gap-2 text-sm font-medium text-emerald-700">
          <CheckCircle2 aria-hidden size={18} />
          User {mode === 'edit' ? 'updated' : 'created'} successfully.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
          {errors.root?.message && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errors.root.message}</p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="First Name" error={errors.firstName?.message}>
              <Input
                {...register('firstName')}
                maxLength={100}
                disabled={isSubmitting}
                hasError={Boolean(errors.firstName)}
              />
            </Field>

            <Field label="Middle Name" error={errors.middleName?.message}>
              <Input
                {...register('middleName')}
                maxLength={100}
                disabled={isSubmitting}
                hasError={Boolean(errors.middleName)}
              />
            </Field>

            <Field label="Last Name" error={errors.lastName?.message}>
              <Input
                {...register('lastName')}
                maxLength={100}
                disabled={isSubmitting}
                hasError={Boolean(errors.lastName)}
              />
            </Field>

            <Field label="Email" error={errors.email?.message}>
              <Input
                type="email"
                {...register('email')}
                maxLength={254}
                disabled={isSubmitting}
                hasError={Boolean(errors.email)}
              />
            </Field>

            <Field label="Phone Number" error={errors.phoneNumber?.message}>
              <Input
                type="tel"
                {...register('phoneNumber')}
                maxLength={30}
                disabled={isSubmitting}
                hasError={Boolean(errors.phoneNumber)}
              />
            </Field>

            <Field label="Registered" error={errors.registered?.message}>
              <Input
                type="date"
                {...register('registered')}
                disabled={isSubmitting}
                hasError={Boolean(errors.registered)}
              />
            </Field>
          </div>

          <Field label="Address" error={errors.address?.message}>
            <Input
              {...register('address')}
              maxLength={300}
              disabled={isSubmitting}
              hasError={Boolean(errors.address)}
            />
          </Field>

          <Field label="Admin Notes" error={errors.adminNotes?.message}>
            <Textarea
              {...register('adminNotes')}
              maxLength={2000}
              disabled={isSubmitting}
              rows={3}
              hasError={Boolean(errors.adminNotes)}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
