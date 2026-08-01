import { useId, useRef, useState } from 'react';
import Modal from './Modal';
import Button from './ui/Button';
import { ApiError } from '../lib/apiClient';
import { useDeleteUser } from '../hooks/useUserMutations';
import { useUIStore } from '../store/useUIStore';

export default function DeleteConfirmDialog() {
  const dialog = useUIStore(state => state.dialog);
  const closeDialog = useUIStore(state => state.closeDialog);
  const titleId = useId();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const deleteUser = useDeleteUser();
  // See the equivalent guard in UserFormModalContent - `deleteUser.isPending` alone can't
  // catch a second click fired before React re-renders the disabled button.
  const isDeletingRef = useRef(false);

  if (dialog.type !== 'delete') {
    return null;
  }

  const { user } = dialog;

  const handleConfirm = async () => {
    if (isDeletingRef.current) {
      return;
    }

    isDeletingRef.current = true;
    setErrorMessage(null);
    setIsNotFound(false);

    try {
      await deleteUser.mutateAsync(user.id);
      closeDialog();
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setErrorMessage('This user was already deleted.');
        setIsNotFound(true);
      } else if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      isDeletingRef.current = false;
    }
  };

  return (
    <Modal
      onClose={closeDialog}
      closeOnEscape={!deleteUser.isPending}
      closeOnBackdropClick={!deleteUser.isPending}
      titleId={titleId}
    >
      <h2 id={titleId} className="text-lg font-semibold tracking-tight text-slate-900">
        Delete {user.firstName} {user.lastName}?
      </h2>
      <p className="mt-2 text-sm text-slate-600">This action cannot be undone.</p>

      {errorMessage && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
      )}

      <div className="mt-6 flex justify-end gap-2">
        {isNotFound ? (
          <Button onClick={closeDialog}>Close</Button>
        ) : (
          <>
            {/* Cancel comes first in DOM order so it - not the destructive action - gets
                default focus on open, matching the focus trap's "focus first element" rule. */}
            <Button type="button" variant="secondary" onClick={closeDialog} disabled={deleteUser.isPending}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirm} disabled={deleteUser.isPending}>
              {deleteUser.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
