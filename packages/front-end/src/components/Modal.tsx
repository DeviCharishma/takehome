import type { ReactNode, RefObject } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ModalProps {
  onClose: () => void;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  titleId: string;
  initialFocusRef?: RefObject<HTMLElement>;
  children: ReactNode;
}

// Only ever rendered while open (the caller conditionally mounts it) - the focus trap's
// mount/unmount lifecycle is exactly "modal opens" / "modal closes".
export default function Modal({
  onClose,
  closeOnEscape = true,
  closeOnBackdropClick = true,
  titleId,
  initialFocusRef,
  children,
}: ModalProps) {
  const containerRef = useFocusTrap<HTMLDivElement>({
    onEscape: closeOnEscape ? onClose : undefined,
    initialFocusRef,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-backdrop-in">
      <div
        role="presentation"
        className="absolute inset-0"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl animate-modal-in"
      >
        {children}
      </div>
    </div>
  );
}
