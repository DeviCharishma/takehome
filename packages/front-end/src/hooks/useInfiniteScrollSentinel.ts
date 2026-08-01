import { useEffect, useRef } from 'react';

interface UseInfiniteScrollSentinelOptions {
  onIntersect: () => void;
  enabled: boolean;
}

/**
 * Returns a ref to attach to a sentinel element. When that element scrolls into view
 * (and `enabled` is true), `onIntersect` fires.
 */
export function useInfiniteScrollSentinel({ onIntersect, enabled }: UseInfiniteScrollSentinelOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Kept out of the effect's dependency array so a new inline `onIntersect` each render
  // doesn't tear down and recreate the observer.
  const onIntersectRef = useRef(onIntersect);
  onIntersectRef.current = onIntersect;

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          onIntersectRef.current();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}
