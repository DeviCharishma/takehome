import { useId, useState } from 'react';
import Modal from './Modal';
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

  if (dialog.type !== 'delete') {
    return null;
  }

  const { user } = dialog;

  const handleConfirm = async () => {
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
    }
  };

  return (
    <Modal
      onClose={closeDialog}
      closeOnEscape={!deleteUser.isPending}
      closeOnBackdropClick={!deleteUser.isPending}
      titleId={titleId}
    >
      <h2 id={titleId} className="text-lg font-semibold text-neutral-900">
        Delete {user.firstName} {user.lastName}?
      </h2>
      <p className="mt-2 text-sm text-neutral-600">This action cannot be undone.</p>

      {errorMessage && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
      )}

      <div className="mt-6 flex justify-end gap-2">
        {isNotFound ? (
          <button
            type="button"
            onClick={closeDialog}
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            Close
          </button>
        ) : (
          <>
            {/* Cancel comes first in DOM order so it - not the destructive action - gets
                default focus on open, matching the focus trap's "focus first element" rule. */}
            <button
              type="button"
              onClick={closeDialog}
              disabled={deleteUser.isPending}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={deleteUser.isPending}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteUser.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
