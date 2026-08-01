import { useUIStore } from '../store/useUIStore';
import UserFormModalContent from './UserFormModalContent';

export default function UserFormModal() {
  const dialog = useUIStore(state => state.dialog);
  const closeDialog = useUIStore(state => state.closeDialog);

  // Remounts the form (fresh useForm() + defaultValues) whenever the target changes, instead
  // of imperatively resetting an existing form instance.
  if (dialog.type === 'edit') {
    const editingUser = dialog.user;
    return <UserFormModalContent key={editingUser.id} mode="edit" user={editingUser} onClose={closeDialog} />;
  }

  if (dialog.type === 'add') {
    return <UserFormModalContent key="add" mode="add" user={null} onClose={closeDialog} />;
  }

  return null;
}
