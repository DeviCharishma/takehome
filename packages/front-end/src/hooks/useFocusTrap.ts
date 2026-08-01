import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface UseFocusTrapOptions {
  onEscape?: () => void;
  /** Element to focus on mount. Defaults to the first focusable descendant. */
  initialFocusRef?: RefObject<HTMLElement>;
}

/**
 * Traps Tab navigation within the returned container ref, focuses an initial element on mount,
 * fires `onEscape` on the Escape key, and restores focus to whatever was focused before mount
 * when the component unmounts. Meant to be used on a component that's only ever mounted while
 * the thing it controls (e.g. a modal) is open.
 */
export function useFocusTrap<T extends HTMLElement>({ onEscape, initialFocusRef }: UseFocusTrapOptions = {}) {
  const containerRef = useRef<T>(null);

  // Kept out of the effect's dependency array so a new inline `onEscape` each render doesn't
  // tear down and reattach the listener (which would also re-run the initial-focus logic).
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusTarget = initialFocusRef?.current ?? containerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    focusTarget?.focus();

    function getFocusable(): HTMLElement[] {
      if (!containerRef.current) {
        return [];
      }

      return Array.from(containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onEscapeRef.current?.();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = getFocusable();
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // The trigger element can be gone by the time this runs (e.g. deleting a row removes
      // its own Delete button). Focus silently falls back to <body> in that case, leaving
      // keyboard users to Tab in from the very top of the page - fall back to the main
      // landmark instead, which `index.tsx` makes programmatically focusable for this reason.
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      } else {
        document.querySelector<HTMLElement>('main')?.focus();
      }
    };
  }, [initialFocusRef]);

  return containerRef;
}
